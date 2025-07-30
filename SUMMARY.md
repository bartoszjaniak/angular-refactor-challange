## Co zrobiłem w ramach poprawek aplikacji oraz rozwoju nowych funkcjonalności

### Code Review (Zadanie 1)
Umieściłem oryginalny kod na branchu i stworzyłem Pull Request: 
https://github.com/bartoszjaniak/angular-refactor-challange/pull/1
> Tutaj część komentarzy po poprawkach okazała się nie aktualna a części rzeczy nie zauważyłem na etapie code review a dopiero podczas pracy, postanowiłem jednak zostawić komentarze tak jak je pierowtnie napisałem.


### Poprawione błędy
✅ Poprawiłem błedy związane z pobieraniem danych użytkownika (detal)
✅ Dodałem modele do danych tak by pozbyć się any
✅ Poprzedni kod korzystał z subskrypcji których nie zamykał co mogło powodować wycieki pamięci. Poprwiłem to.
✅ Tabela nie była dostępna (a11y), nie było jasno oznaczone gdzie trzeba kliknąć aby przejść do detalu, zmieniłem przyciski na linki bo tym w zasadzie były.
✅ Strona użytkowniak (detal) także miała problemy z dostępnością, przyciski były nieopisane i były zwykłymi buttonami nawet jak tak na prawdę były linkiem. Poprawiłem to.
✅ Synchronizacja nie działała i była źle podpięta. Poprawiłem payload tak by korzystał z ID, subskrypcję notyfikacji z serwera przeniosłem do głównego komponentu aplikacji - to niezależne od użytkonika.

### Dodane nowe funkcjonalności
✅ Filtrowanie, sortowanie i paginacja tabeli oparta na store. Funkcjonalność pokryta testami jednostkowymi.
✅ Oprócz danych użytkowników serwer zwracał całkowitą liczbę rekordów co było potrzebne do poprawnej paginacji, wykorzystałem to pole.
✅ Dodałem snackbar informujący o synchronizacji z serwerem 
✅ Dodałem mechanizm dodawania i usuwania użytkowników do ulubionych. Stan ulubionych jest przechowywany i synchronizowany z localstorage. 
✅ Dodałem internationalziację. Możliwa jest zmiana języka. Wybrany język przechowywany jest w localstorage dzięki czemu po przeładowaniu strony mamy wybrany wcześniej język.
✅ Poprawiłem nieco UI strony użytkownika.


### Uwagi
🧙 Chciałem skorzystać z nowej biblioteki sygnałowej ale zgodnie z opisem stanowiska i w sumie tego jak już to było zrobione, pozostawiłem kod z wykorzystaniem NgRx. Przejście na sygnały oznaczałoby duży refaktor i pozostawienie minimalnej ilości oryginalnych komponentów, założyłem że zazwyczaj w pracy raczej takie zmiany powstają w ramach ewolucji a nie rewolucji.

⚠️ Poprawiłem synchronizację użytkownika ma serwerze ponieważ nie korzystał z ID ale z indexu w tabeli. Powodowało to synchronizacje i zwracanie innego rekordu niż wysyłny. <- standardowo to byłoby pewnie requestem do backendowców o poprawę.