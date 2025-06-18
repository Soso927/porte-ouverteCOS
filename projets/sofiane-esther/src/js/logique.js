document.addEventListener("DOMContentLoaded", () => {
  const data = {
    dev: {
      questions: [
        {
          question: "Qu'est-ce qu'un bug ?",
          reponses: ["Un insecte", "Une erreur", "Une fonctionnalité"],
          correct: 1
        },
        {
          question: "HTML est ?",
          reponses: ["Un langage de programmation", "Un langage de balisage", "Une base de données"],
          correct: 1
        },
      {
      question: "Quel élément HTML est utilisé pour insérer une image ?",
      reponses: ["<img>", "<picture>", "<image>", "<imagefile>"],
      correct: 0
    },
    {
      question: "Quelle balise HTML est utilisée pour créer un lien hypertexte ?",
      reponses: ["<a>", "<p>", "<h1>", "<h3>"],
      correct: 0
    },
    {
      question: "Quelle propriété CSS est utilisée pour changer la couleur de fond ?",
      reponses: ["color", "background-color", "border-color", "text-color"],
      correct: 1
    },
    {
      question: "Quel est l'effet de la propriété CSS 'text-align' ?",
      reponses: [
        "Aligner le texte verticalement",
        "Aligner le texte horizontalement",
        "Modifier la couleur du texte",
        "Appliquer une ombre au texte"
      ],
      correct: 1
    },
    {
      question: "Quelle balise HTML définit un titre de niveau 1 ?",
      reponses: ["<header>", "<h1>", "<title>", "<h6>"],
      correct: 1
    }
      ]
    },
    bienveillance: {
      questions: [
        {
          question: "La bienveillance, c’est avant tout :",
          reponses: [
            "Faire plaisir à tout le monde",
            "Être gentil même quand on est en colère",
            "Porter attention aux autres avec respect et compréhension",
            "Éviter les conflits à tout prix"
          ],
          correct: 2
        },
        {
          question: "Que faire si un·e collègue se trompe pendant un quiz ?",
          reponses: [
            "Le corriger publiquement immédiatement",
            "Lui faire une remarque sarcastique pour détendre l’atmosphère",
            "Ne rien dire du tout",
            "L’encourager et l’aider à comprendre l’erreur"
          ],
          correct: 3
        },
        {
          question: "Quel est un exemple de communication bienveillante ?",
          reponses: [
            "« Franchement, c’est évident comme question ! »",
            "« Tu n’as pas révisé ou quoi ? »",
            "« Je ne suis pas d’accord, mais je comprends ton raisonnement. »",
            "« Je préfère quand c’est moi qui réponds. »"
          ],
          correct: 2
        },
        {
          question: "Quelle attitude favorise un climat bienveillant pendant un jeu ?",
          reponses: [
            "Couper la parole pour aller plus vite",
            "Laisser de l’espace pour que chacun·e s’exprime",
            "Imposer ses réponses quand on est sûr·e",
            "S’impatienter quand quelqu’un hésite"
          ],
          correct: 1
        },
        {
          question: "Quel comportement est le plus bienveillant dans un groupe ?",
          reponses: [
            "Partager ses connaissances sans écraser les autres",
            "Essayer d’avoir toujours raison",
            "Ignorer les idées qui ne nous plaisent pas",
            "Faire des blagues sur les erreurs des autres"
          ],
          correct: 0
        },
        {
          question: "Quand une personne partage une idée, on doit :",
          reponses: [
            "L’écouter sans l’interrompre",
            "Répondre tout de suite pour donner son avis",
            "Lui dire si on pense qu’elle se trompe",
            "Ignorer si ce n’est pas intéressant"
          ],
          correct: 0
        },
        {
          question: "La bienveillance, c’est aussi :",
          reponses: [
            "Dire ce que l’on pense sans filtre",
            "Choisir des mots qui respectent l’autre",
            "Éviter tout conflit même si c’est important",
            "Ne jamais critiquer"
          ],
          correct: 1
        },
        {
          question: "Comment réagir si quelqu’un a du mal à comprendre ?",
          reponses: [
            "Lui expliquer patiemment avec des exemples",
            "Lui dire de revoir les bases",
            "L’ignorer pour ne pas perdre de temps",
            "Demander à quelqu’un d’autre de répondre"
          ],
          correct: 0
        },
        {
          question: "Un compliment bienveillant est :",
          reponses: [
            "Flatteur mais faux",
            "Sincère et encourageant",
            "Utilisé pour manipuler",
            "Fait uniquement quand quelqu’un gagne"
          ],
          correct: 1
        },
        {
          question: "La bienveillance est utile dans un quiz parce que :",
          reponses: [
            "Elle permet de gagner plus facilement",
            "Elle rend l’ambiance plus agréable pour tout le monde",
            "Elle permet de juger ceux qui ne savent pas",
            "Elle élimine la compétition"
          ],
          correct: 1
        }
      ]
    },
    humour: {
      questions: [
        {
          question: "Pourquoi les dev rient-ils ?",
          reponses: [
            "Ils ne rient jamais",
            "Parce qu'ils ont du code drôle",
            "Parce qu'ils ne comprennent pas"
          ],
          correct: 1
        },
        {
          question: "Pourquoi les pirates n’utilisent jamais de balises <table> en HTML ?",
          reponses: [
            "Parce qu’ils préfèrent les bateaux aux tableaux ! 🏴‍☠️",
            "Parce que ça les fait ramer comme sur un galion.",
            "Ils pensent que <table> c’est une mutinerie sémantique."
          ],
          correct: 0
        },
        {
          question: "Quel est le langage préféré des pirates développeurs ?",
          reponses: [
            "Rrrrruby ! 💎",
            "JavaArrrrr ! ☕",
            "C-shaaarrrp ! 🎻"
          ],
          correct: 1
        },
        {
          question: "Pourquoi le pirate a refusé de commit son code ?",
          reponses: [
            "Parce qu’il voulait garder son trésor en local ! 🗺️",
            "Il n’avait pas confiance en GitHub, il préfère les coffres forts.",
            "Il a cru que `git push` allait le pousser à l’eau."
          ],
          correct: 0
        },
        {
          question: "Comment un pirate débogue son site ?",
          reponses: [
            "Il utilise la console pour trouver les bugs... et les bouteilles de rhum. 🍹",
            "Il crie ‘Arrr!’ jusqu’à ce que le bug s’en aille.",
            "Il envoie le site marcher sur la planche."
          ],
          correct: 1
        },
        {
          question: "Pourquoi les pirates détestent les 404 ?",
          reponses: [
            "Parce qu’ils cherchent toujours leur trésor, pas une page perdue ! 🧭",
            "Ils croient que c’est le code pour un naufrage.",
            "Ils pensent que 404 est un rival du Capitaine Crochet."
          ],
          correct: 0
        }
      ]
    }
  };

  const buttons = document.querySelectorAll("#choix-theme button");
  const quizContainer = document.getElementById("quiz-container");
  let currentQuestions = [];
  let currentQuestionIndex = 0;

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const theme = button.dataset.theme;
      currentQuestions = data[theme].questions;
      currentQuestionIndex = 0;
      afficherQuestion(currentQuestions[currentQuestionIndex]);
    });
  });

  function afficherQuestion(questionObj) {
    const question = document.querySelector('#question');
    const reponses = document.querySelector('#answers');
    const feedback = document.getElementById("feedback");

    question.textContent = questionObj.question;
    reponses.innerHTML = '';
    feedback.textContent = '';

    questionObj.reponses.forEach((reponse, index) => {
      const li = document.createElement('li');
      li.textContent = reponse;
      li.addEventListener("click", () => verifierReponse(index, questionObj.correct, questionObj.reponses));
      reponses.appendChild(li);
    });
  }

  function verifierReponse(indexUtilisateur, indexCorrect, answers) {
    const feedback = document.getElementById("feedback");
    if (indexUtilisateur === indexCorrect) {
      feedback.textContent = "✅ Bonne réponse !";
    } else {
      feedback.textContent = `❌ Mauvaise réponse. La bonne était : "${answers[indexCorrect]}"`;
    }

    const buttons = document.querySelectorAll("#answers li");
    buttons.forEach(b => b.style.pointerEvents = "none");

    setTimeout(() => {
      currentQuestionIndex++;
      if (currentQuestionIndex < currentQuestions.length) {
        afficherQuestion(currentQuestions[currentQuestionIndex]);
      } else {
        quizContainer.innerHTML = `<p class="resultats">🎉 Bravo futur stagiaire ! Tu as terminé ce thème !</p>`;
      }
    }, 2000);
  }
});
