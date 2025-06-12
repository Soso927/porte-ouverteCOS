# Quizz / Jeu de l'oie
Cette application est un jeu développé en Javascript.
Sur le principe d'un jeu de l'oie mais agrémenté d'un quizz pour faire avancer son pion sur le plateau.

Les questions et leurs réponses sont chargées à partir de https://quizzapi.jomoreschi.fr/api/v1/quiz.

Le dé est un code de Steve Robertson (https://codepen.io/SteveJRobertson/pen/dPVgqK).

Le plateau du jeu provient de https://fr.freepik.com/

# Règle du jeu

## Quizz à 3 niveaux de difficultées :
- Facile
- Normal
- Difficile

## Thèmes possible pour chaque question :
- TV & Cinéma
- Art & Littérature
- Musique
- Actualité politique
- Culture générale
- Sport
- Jeux videos

## À chaque tour :
Le dé est lancé automatiquement.
Si la réponse à la question est correct le pion avance du nombre indiqué par le dé.
Pour passer à la question suivante, appuyez sur le bouton ⏭

## Cases spéciales :
- Case 5 → Avance directement à la case 14.
- Case 24 → Avance directement à la case 29.
- Case 37 → Recule à la case 18.
- Case 42 → Avance à la case 39.

## Règles de déplacement :
Votre pion avance en fonction du nombre indiqué sur le dé.
Si le résultat dépasse la case 46, il doit reculer de la différence.

## Fin du jeu :
Le jeu se termine quand le joueur atteint exactement la case 46.
Il faut faire très attention au dernier déplacement pour ne pas dépasser !

Pour lancer une nouvelle partie appuyez sur le bouton  ⟳.

Certains niveaux ont un nombre restreint de questions.
Si vous n'avez pas atteint l'arrivée avant la fin de la liste de question, vous serez Game Over.