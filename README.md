adoc= Globális Fizetési Átjáró (Global Payment Service) — Fullstack Próbafeledat
Bankmonitor Hiring Task <interview@bankmonitor.hu>
v1.0.0, 2026-09-23
:toc: macro
:toc-title: Tartalomjegyzék
:toclevels: 3
:numbered:

toc::[]

== Áttekintés és Mérnöki Döntések

Ez a projekt egy új generációs, elosztott fizetési átjáró prototípusa, amely egy modern *Spring Boot backend* és egy *React + TypeScript frontend* rétegből áll. 

A fejlesztés során a feladat kiírásában javasolt **~3 órás időkeretet** szigorúan szem előtt tartva a fókuszt a **sziklaszilárd maglogika**, az **adatintegritás**, valamint a **skálázható, tiszta architektúra** kialakítására helyeztem. A szoros határidő miatt bizonyos kényelmi és infrastrukturális funkciókat tudatosan elhalasztottam; ezeket a <<_todo_lista_es_tovabblepesi_iranyok, TODO listában>> részletezem.

=== Alkalmazott Technológiai Stack
* *Backend:* Java 21, Spring Boot 4.x, Spring Data JPA, PostgreSQL Driver, Lombok, Jackson.
* *Adatbázis:* Lokális PostgreSQL (Docker konténerben running).
* *Frontend:* React 18+, TypeScript, Vite, Material UI (MUI) v5/v6, Axios.

---

== Architekturális felépítés

=== Backend (Domain-Driven / Layered)
A backend rétegei szigorúan elszeparáltak, az adatok áramlását típusbiztos DTO-k és Java `record`-ok biztosítják a REST végpontok és az üzleti logika között.
* *Controller Réteg:* Befogadja a kéréseket, elvégzi a JSR-380 input validációt (`@Valid`), és kinyeri a kötelező hálózati metaadatokat (pl. `X-Idempotency-Key` HTTP Header).
* *Service Réteg:* Tranzakcionális határokat húz (`@Transactional`), koordinálja az üzleti logikát és kezeli a zárolásokat.
* *Repository Réteg:* Közvetlen, absztrakt kapcsolat az adatbázissal Spring Data JPA alapokon.

=== Frontend (Feature-Based / Domain-Driven)
A monolitikus frontend struktúra helyett egy modern, skálázható **feature-based** könyvtárszerkezetet alakítottam ki az `src/features/` mappa alatt. Minden domain (pl. `account`, `transfer`) saját elszeparált egységet alkot:
```text
src/
├── api/             # Globális Axios konfiguráció és interceptorok
├── features/
│   ├── account/     # Számlakezelés feature
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   └── transfer/    # Utalási logika feature
└── pages/           # Oldalszintű aggregációk (AccountsPage, TransferPage)
```
Minden komponens modern **arrow function (lambda) szintaxissal** íródott, a megítélésében elavult `React.FC` burkolót teljesen elhagytam a tiszta TypeScript típuslevezetés érdekében. Az üzleti logikát és a vizuális megjelenítést egyedi hookok (pl. `useAccounts`, `useTransfer`) választják el egymástól.

---

== Edge Case-ek és Reziliencia Kezelése

=== 1. Konkurencia és Adatintegritás (Race Condition védelem)
Párhuzamos terhelés alatt (amikor egy számlát egyszerre több utalási kérés érint) fennáll a *Lost Update* (elveszett módosítás) kockázata. Ennek kiküszöbölésére az `AccountRepository`-ban **Pesszimisztikus Írási Zárolást** (`@Lock(LockModeType.PESSIMISTIC_WRITE)`) vezettem be a számlák lekérdezésekor.

*Deadlock Védelem:* Ha az "A" számláról utalunk "B"-re, miközben egy másik szálon "B"-ről utalunk "A"-ra, a két szál keresztbe zárolhatja egymást. Ezt úgy védtem le, hogy a `TransferService`-ben a számlák zárolási sorrendjét mindig a numerikus adatbázis-azonosítójuk alapján növekvő sorrendbe rendezem (`Math.min` / `Math.max`), így a deadlock kialakulása matematikailag lehetetlen.

=== 2. Idempotencia (Dupla terhelés elleni védelem)
A hálózati szakadásokból eredő ismételt frontend próbálkozások ellen egy dedikált `idempotency_keys` táblát vezettem be. 
* Ha egy kulcs először érkezik, az állapota `IN_PROGRESS`-re változik.
* Ha a feldolgozás alatt újabb kérés jön ugyanazzal a kulccsal, a rendszer `409 Conflict` hibát dob.
* Sikeres lefutás után a válasz JSON struktúráját szövegként (`TEXT`) lementjük. Bármilyen későbbi ismételt kérés esetén a backend nem futtatja újra az utalást, hanem közvetlenül ezt a mentett cache-t adja vissza `21 Created` kíséretében.

=== 3. Külső Flaky API és Reziliencia
A megbízhatatlan külső árfolyam-szolgáltatás okozta véletlenszerű 503-as hibákat és hálózati ingadozásokat egy beépített transzparens **Retry (újrapróbálkozási) algoritmussal** kezeli az `ExchangeRateService`. Lineáris backoff késleltetéssel (200ms) maximum 3 alkalommal próbálja megismételni a hívást, mielőtt véglegesen hibát dobna az ügyfélnek.

---

== TODO Lista és Továbblépési Irányok

Az alábbi fejlesztéseket a 3 órás prototípus-fázis után, egy teljes fejlesztési sprint (1-2 hét) keretében valósítanám meg:

=== 🚀 Backend & Infrastruktúra Élesítése
- [ ] **Biztonság (API Key Filter):** Egy testreszabott `OncePerRequestFilter` bevezetése a Spring Security-be, amely minden bejövő kérésnél ellenőrzi az `X-API-KEY` fejléc meglétét és validitását.
- [ ] **API Dokumentáció (Swagger/OpenAPI):** A `springdoc-openapi-starter-webmvc-ui` függőség integrálása. A kontrollerek felruházása `@Operation` és `@ApiResponse` annotációkkal az automatikus és interaktív API dokumentációért (`/swagger-ui.html`).
- [ ] **Adatbázis sémamigráció (Flyway / Liquibase):** A prototípusban használt gyors `ddl-auto: update` és `data.sql` kikapcsolása (`none`), helyette verziókövetett, inkrementális SQL migrációs szkriptek bevezetése.
- [ ] **Valódi Üzenetsor Integráció (Kafka / RabbitMQ):** Az alkalmazáson belüli aszinkron Spring Event-eket (`ApplicationEventPublisher`) leváltani egy valódi elosztott üzenetsorra, hogy a Fraud és Notification domainek teljesen különálló mikroszolgáltatásként is üzemelhessenek.

=== 🎨 Frontend & UX Finomítások
- [ ] **API Key Továbbítás:** Az `axiosClient.ts` interceptorának kibővítése, hogy a böngészőből vagy környezeti változókból (`.env`) kinyert biztonsági tokent minden kérés fejlécesében automatikusan kiküldje.
- [ ] **Design & Üzenetmegjelenítés javítása:** A jelenlegi statikus alert dobozok leváltása egy központi, globális Snackbar / Toast értesítési rendszerre (pl. `notistack`), amely az üzeneteket (sikeres utalás, hálózati hiba) elegánsabb módon jeleníti meg, anélkül, hogy eltolná a UI elemeit.
- [ ] **Magasabb fokú szeparáltság és újrafelhasználhatóság:** A táblázatok (`AccountTable`) és űrlapok belső MUI elemeit tovább bontani mikrolevelek szintjére (pl. saját `CurrencySelect`, `FormButton`, `ResponsiveCard` atomi komponensek kialakítása).
- [ ] **Epic 4 Frontend megvalósítása:** A backend oldalon már 100%-ban kész tranzakciós végpontok bekötése egy harmadik, "Tranzakciók" fül alá az `App.tsx`-ben.

=== 🧪 Átfogó Tesztelési Piramis Kiépítése
- [ ] **Unit tesztek (Egységtesztek):** A szerviz rétegek (`AccountService`, `TransferService`) teljes lefedése Mockito segítségével, izoláltan tesztelve az üzleti döntéseket és validációkat.
- [ ] **Integration tesztek (Integrációs tesztek):** `@SpringBootTest` környezetben, `Testcontainers` (PostgreSQL) segítségével ellenőrizni az idempotencia kulcsok adatbázis-szintű viselkedését, és a Pesszimisztikus írási zárolás helyességét párhuzamos szálakon futtatva.
- [ ] **Regressziós és E2E tesztek:** Frontend oldalon Vitest és React Testing Library alkalmazása a komponensek viselkedésének tesztelésére, valamint Playwright vagy Cypress bevezetése a teljes fullstack utalási folyamat automatizált, képernyőkön átívelő teszteléséhez.

---

== Alkalmazás Futtatása és Tesztelése

=== Lokális környezet indítása (Docker)
Az adatbázis elindításához futtasd a projekt gyökerében:
[source,bash]
----
docker compose up -d
----

=== Backend indítása
[source,bash]
----
mvn spring-boot:run
----
A backend elindulása után a `data.sql` automatikusan inicializál 3 db tesztszámlát (HUF, EUR, USD azonosítókkal: #1, #2, #3).

=== Frontend indítása
[source,bash]
----
npm run dev
----
A felület alapértelmezetten a `http://localhost:5173` címen válik elérhetővé.
