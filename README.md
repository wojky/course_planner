# Planer kursów trenerskich

Statyczna aplikacja po polsku do planowania kursu UEFA Elite Youth A.

## Funkcje

- Sesje, dni, zajęcia i przerwy — dodawanie, edycja, usuwanie z potwierdzeniem.
- 20 edytowalnych kompetencji z modelu: Ja, Środowisko, Drużyna.
- Wyszukiwany wielokrotny wybór kompetencji dla zajęć.
- Analityka całego programu: liczba zajęć i czas dla kompetencji, pary i pełne zestawy.
- Automatyczny zapis localStorage, eksport JSON i walidowany import z potwierdzeniem zastąpienia kursu.
- Wykrywanie nakładających się godzin i wydruk wybranego dnia.

## Dane startowe

Harmonogram sesji 2 (5–7 października 2026) i model kompetencyjny przepisano z materiałów użytkownika. Logo pochodzi z jego harmonogramu. Godziny zachowano zgodnie ze źródłem; rozbieżności czasu oznaczono w notatkach. Kompetencje zajęć są początkowo nieprzypisane, ponieważ załącznik nie zawierał tych danych.

## Uruchomienie

Dowolny statyczny serwer HTTP z katalogiem głównym `dist`. Bez zależności i etapu kompilacji. Manifest `.openai/hosting.json` wskazuje publikację statyczną Sites.

- `dist/model.js`: struktura, dane startowe, walidacja importu, obliczenia.
- `dist/app.js`: widoki, edytory, zapis i import/eksport.
- `dist/style.css`: wygląd, układ mobilny, wydruk.

## Zapis i obliczenia

Klucz localStorage: `pzpn-course-planner-v1`. Eksport zawiera `schemaVersion: 1`, `course`, `ui` i `updatedAt`. Dane są lokalne dla danej przeglądarki i domeny. Brak synchronizacji serwerowej.

Zajęcia nie przechodzą przez północ. Czas wynika z różnicy godzin. 1 godzina lekcyjna = 45 min. Każda kompetencja otrzymuje cały czas przypisanych zajęć; suma kompetencji może przekraczać czas kursu. Przerwy nie są liczone. Pary są zliczane także w szerszych zestawach, pełne zestawy wyłącznie przy identycznym składzie.

## Weryfikacja

Sprawdzono składnię JavaScript, dane startowe (13 zajęć, 1055 minut, 20 kompetencji), liczenie czasu i kombinacji, wykrywanie kolizji, odrzucanie nieprawidłowego importu i niebezpiecznych identyfikatorów. Test z atrapą DOM objął widoki, operacje dodawania/edycji/usuwania, wielokrotny wybór, kaskadowe usuwanie powiązań, localStorage oraz anulowanie i zatwierdzanie importu. Podgląd wizualny w przeglądarce nie był dostępny w tym środowisku dla statycznej aplikacji.
