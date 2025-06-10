# DREAMLAND - NEMASU PROJECT

### Lien pour jouer au jeu:

http://mainline.i3s.unice.fr/JeuClement/

### Lien vidéo

https://youtu.be/Y0p8CGI40J8

Les informations seront séparées en deux parties ; tout d'abord celles importantes pour jouer au jeu, et ensuite mes retours personnels du projet.

## Informations importantes

Membres de l'équipe / pseudonymes Github:

BETEILLE Clément / clellw

### Description du jeu

Nemasu Project est un jeu en 3D à la 3ème personne qui combine jeu d'aventure et jeu de tir. L'objectif et de venir en aide à des personnes victimes d'un étrange incident, les plongeants dans un rêve dont elles ne peuvent pas sortir. Alors que Reimu profitait de son jour de repos, elle est rapidement impliquée dans cet incident et forcée à agir pour le bien de ses amies.

### Comment jouer

Le jeu se joue à la troisième personne et vous permet de vous déplacer dans toutes les directions que vous voulez:

Z: Avancer

S: Reculer

Q: tourner à gauche

D: tourner à droite

C: Monter

V: Descendre

Maintenir SHIFT: Ralentir la vitesse de déplacement

Souris: Bouger la caméra / Zoom

Une fois en combat, Il vous sera possible d'attaquer avec des projectiles:

Clic souris: tirer

Lors des combats, vous devez tirer sur le boss afin de réduire sa barre de vie à zéro. Le boss va également envoyer des projectiles dans votre direction, que vous devrez esquiver. Si vous êtes touchés, vous serez incapables de bouger et de tirer pendant quelques secondes, mais votre personnage n'a pas de barre de vie, donc pas besoin d'avoir peur de perdre une vie ou de recommencer le combat.

### Eléments du jeu

- Personnages:

Le jeu s'inspire beaucoup de la série de jeux-vidéos _Touhou Project_, créée par ZUN. Les personnages présents dans le jeu sont tous des personnages provenant de _Touhou Project_, listés ci-dessous par ordre d'apparition dans le jeu :

HAKUREI Reimu

Rumia

Cirno

SWEET Doremy

Nazrin

SHAMEIMARU Aya

KOCHIYA Sanae

USAMI Sumireko

D'autres personnages sont mentionnés dans les dialogues mais n'apparaissent pas dans le jeu:

KISHIN Sagume, WATATSUKI no Yorihime, WATATSUKI no Toyohime, YAGOKORO Eirin, YAKUMO Yukari, MATARA Okina.

- Modèles 3D:

Les modèles des personnages ont étés créés pour le jeu par moi sur le logiciel de modélisation _Blender_ et représentent les personnages mentionnés précédement qui apparaissent dans le jeu. les modèles des décors présents dans le jeu proviennent du site internet _Kenney_. Les autres modèles 3D et textures ont étés créés avec la bibliothèque de BabylonJS.

- Musiques:

Les musiques utilisées proviennent de différents jeux-vidéos. Elles sont listées ci-dessous par ordre d'utilisation dans le jeu avec leurs jeux d'origine:

01.Revolving Secret Garden - _Touhou Lost Word_

02.Rescue Team Base - _Pokemon Mystery Dungeon : Red Rescue team_

03.Crags of Lament - _Pokemon Mystery Dungeon : Gates to Infinity_

04.Tomboyish Girl in Love - _Touhou 06 - 東方紅魔郷 〜 Embodiment of Scarlet Devil_

05.Mt.Horn - _Pokemon Mystery Dungeon : Explorers of Sky_

06.At the Harbor of Spring - _Touhou 12 - 東方星蓮船 〜 Undefined Fantastic Object_

07.In the Nightmare - _Pokemon Mystery Dungeon : Explorers of Sky_

08.Youkai Mountain ~ Mysterious Mountain - _Touhou 10 - 東方風神録 ～ Mountain of Faith_

09.Undella Town (Autumn-Winter-Spring) - _Pokemon Black & White_

10.Faith Is for the Transient People - _Touhou 10 - 東方風神録 ～ Mountain of Faith_

11.In the Future - _Pokemon Mystery Dungeon : Explorers of Sky_

12.Upper Steam Cave - _Pokemon Mystery Dungeon : Explorers of Sky_

13.Sheer Mountain Range - _Pokemon Super Mystery Dungeon_

14.Last Occultism ~ Esotericist of the Present World - _Touhou 14.5 - 東方深秘録　～ Urban Legend in Limbo_

- Portraits des personnages: 

Des portraits sont utilisés dans le jeu lors des cinématiques. Ils proviennent tous du jeu vidéo _Touhou Puppet Dance Performance (Touhoumon)_, fangame de la série _Touhou Project_.

## Informations Complémentaires

J'ai réalisé ce projet en deux mois dans une équipe dont j'étais le seul membre. Naturellement, j'ai beaucoup de retours à faire sur mon expérience et sur le jeu que j'ai réalisé. J'avais depuis longtemps en tête le résultat que je voulais atteindre et je pense m'y être rapproché le  plus possible. Certains points sont importants à mentionner d'après moi:

### structure du jeu

le jeu est composé de beaucoup de scènes différentes et leur enchainement peut paraître un peu compliqué. les scènes sont séparées en 4 parties: Les scènes d'exploration, les cinématiques, et les scènes de combat. Les scènes ou le personnage est controllable sont séparées par une ou des cinématiques, et la structure globale des scènes est la suivante:

->Scène d'exploration (Hub scene)
->Cinématique de transition (Transition Cutscene)
->Cinématique du boss (Stage cutscene)
->Scène de combat (Stage Scene)
->Deuxième cinématique de transition (Transition cutscene end)
->Scène d'exploration...

Ces informations peuvent être importantes dans les sections qui suivent.

### Bugs

plusieurs bugs sont présents dans le jeu et, bien qu'il n'empêchent pas le jeu d'être complété, ils peuvent perturber le joueur ou bien le dévellopement du jeu:

- Bug de chargement de scène: Un bug se produisait lors du dévellopement lors du passage d'une scène de transition à une cinématique de transition. Une erreur "no camera defined" s'affichait, mais le jeu se poursuivait sans problème si le joueur efface le message. Ce message d'erreur ne semble pas s'afficher lors d'une partie avec la version build. Je n'ai pas de réponse exacte à pourquoi cela se produit, sachant que se bug est consistant entre tous les passages du même genre dans le jeu. Je pense que la raison est liée au fait que les scènes d'exploration utilisent des "ArcRotateCamera" tandis que les cinématiques utilisent des "FreeCamera" et que la transition doit être mal effectuée dans le code. Cependant, le jeu passe souvent entre ces deux types de caméras, et le bug ne se reproduit pas dans les autres passages entre les scène.

- Bugs de caméra dans les scènes de combat: La caméra ne se place pas correctement derrière le personnage au chargement de la scène. Ceci est contraignant dans le stage 2, ou la caméra se situe initialement dans le mur délimitant la zone de combat, ce qui la rend dur à manipuler au début de stage.

- Bugs de collisions : Ils ne sont pas très nombreux, mais surtout présents dans les scènes de combat, où ils peut-être difficile de toucher le boss avec les projectiles. Il n'est pas impossible de les toucher, mais ça peut surprendre le joueur si la barre de vie ne bouge pas alors qu'il pense toucher le boss. Le joueur peut également se retrouver à esquiver des projectiles qui devraient pourtant le toucher ; ceci est observable surtout dans le stage 3.

- Frame rate: Le jeu peut avoir du mal à afficher les images lors des scènes d'exploration à cause du nombre d'éléments présents sur la carte. La fluidité du jeu reste correcte lors des scènes de combat.

- déplacement du personnage: Ce n'est pas un bug, mais il semble correct de le mentionner ici. Les déplacements du personnages sont différents entre plusieurs scènes. Cela est dû au fait que, pour correspondre à la taille des éléments sur la carte, les modèles 3D sont redimensionnés pour chaque scène, ce qui change les déplacements du personnage, qui utilisent le même script pour chaque combat. J'ai essayé de régler ces problèmes de contrôle au mieux, mais ce problème est surtout visible dans le stage 4, dans lequel il est difficile de tourner.

d'autre bugs sont sûrement présents dans le jeu ; soit j'ai oublié de les mentionner, soit je ne les ai pas rencontrés lors de mes tests.

### Améliorations

Plusieurs points du jeu peuvent être améliorés ou bien sont différents de ce que j'avais envisagé:

- Affichage: le jeu ne s'affiche pas entièrement sur l'écran. C'est un problème que j'ai eu très tôt lors du dévellopement et que je n'ai pas réussi à régler. Si j'essayais de l'afficher sur tout l'écran, mon navigateur affichais une barre de défilemment qui rendant le jeu peu jouable et pas très agréable. Au final, je me suis habitué à la forme du jeu réduite, et ce n'est peut-être pas si mal qu'il en soit resté ainsi.

- Contrôles: Les touches utilisées pour les contrôles du personnage ne sont peut-être pas les plus adaptées pour leur fonction, surtout les touches 'c' et 'v'. La possibilité de joueur au clavier QWERTY aurait été un bon ajout également.

- Ecran titre: Le jeu n'a pas d'écran titre et se lance directement avec la cinématique d'introduction. Il aurait été préférable d'ajouter un écran titre afin d'accueillir au mieux le joueur.

- Longueur du jeu: Le jeu est très court et se fini en moins de 20 minutes. Initialement, il devait y avoir 6 niveaux mais je n'avais pas le temps pour faire le dernier, ce qui n'est pas très grave.

- Difficulté: Le jeu n'est pas très dur et les attaques des boss peuvent paraître très simplistes lors des stages 1 et 2. L'absence de barre de vie pour le joueur est un choix que j'ai effectué très tôt car je ne voulais pas que le jeu soit trop difficile si les contrôles étaient un peu compliqués. Au final, le jeu est très généreux et une barre de vie aurait rendu les combats plus intéressants car ces derniers sont très courts. Le jeu se joue plus dans les cinématiques que dans les niveaux, ce qui est un peu dommage.

- déplacements et animations: Les modèles 3D des personnages ont été réalisés par moi, ainsi que leurs animations. Le seul modèle animé est celui du joueur, qui possède une animation lors de son vol mais qui n'est pas très visible lors d'une partie (Le personnage bouge de haut en bas). Il devait également y avoir une animation de marche lors des déplacements terrestres, mais mon manque d'expérience avec _Blender_ ne m'a pas permis d'en créer une convenable. Concernant  les déplacements, le personnage accélère un peu lors du début de ses mouvements, mais s'arrête brusquement lorsque le joueur arrête de se déplacer. Il devrait ralentir progressivement avant de s'arrêter pour fluidifier les déplacements.

- Carte: la carte des scènes d'exploration a certains aspects qui peuvent être améliorés: Certains éléments sont positionnés au bord du vide ou dans le vide, des modèles 3D sont mals collés ensemble, ce qui fait que la carte a des trous, ...

- Code: Le code a de nombreux points à améliorer et il serait long de tous les mentionner ; les principaux sont surtout les emplacements du code ou la méthode employée n'est pas optimisée ou la plus convenable.

### Bons aspects du jeu

Il y a des éléments du jeu dont je suis fier du rendu final, et il ne suffirait que de quelques ajouts pour les rendre meilleurs:

- Les cinématiques ont un rendu qui me semble correct. Les personnages intéragissent bien entre eux, et les dialogues sont cohérents avec ce qu'il se passe à l'écran. J'ai eu beaucoup de difficultés à synchroniser les dialogues et les mouvements des personnages avec ceux de la caméra et le code qui en a résulté n'est sûrement pas optimisé, mais il n'entrave pas vraiment le rendu. L'humour du jeu me correspond bien et j'ai eu beaucoup de plaisir à écrire les dialogues, même si il y a beaucoup de références et de blagues un peu personnelles qui ne doivent pas faire rire tout le monde. Le jeu serait un peu plus divertissant si il y avait une option pour passer les dialogues, mais alors il deviendrait encore plus court (les dialogues sont assez longs).

- Les modèles 3D des personnages sont assez fidèles aux personnages qu'ils représentent et ils se rapprochent de l'aspect minimaliste que je voulais pour le jeu. Pour les réaliser, je me suis inspiré des miniatures de la chaine youtube _Lyrica Live_ (https://www.youtube.com/@lyrica-live). 

- Les cartes représentant les rêves des personnages sont assez variées et je suis assez content du rendu final qu'elles ont dans le jeu. Il a été assez compliqué de retransmettre les émotions des personnages dans les dialogues et d'expliquer ce qu'il se passait dans leurs rêves, mais c'était amusant d'essayer.

- La structure du jeu ressemble à ce qu'il se fait normalement dans d'autre jeu, où on explore d'abord la carte avant de rencontrer un évènement qui fait avancer l'histoire. Bien que cela reste très simpliste et assez redondant, je suis assez content que le jeu ai gardé cet aspect de connection fluide entre les scènes au travers du dévellopement.

### Retours sur le projet

Quand j'ai entendu parlé du concours, j'ai eu envie d'y participer et j'ai directement eu une idée du résultat final. Avec des amis, on avait l'intention de participer ensemble au projet, mais la quantité de travail que l'on avait à côté leur a fait changer d'avis. Avec du recul, en voyant l'ambition initiale que j'avais, il n'étais pas raisonable de se lancer tout seul dans le projet. Cela m'a permis d'apprendre l'importance d'une équipe lors de la réalisation d'un projet, et de mieux comprendre les charges de travail que je peux réaliser.

Ce projet a été vraiment amusant à réaliser du début jusqu'à la fin, et j'ai découvert de nombreux aspects de la création de jeux-vidéo. J'ai également travaillé avec des outils que je ne pensais jamais utiliser dans ma vie car je pensais qu'ils étaient trop compliqués. Une bonne partie du projet s'est passée sur _Blender_ à modéliser les personnages et à disposer les éléments sur la carte. J'ai aussi passé un long moment à écrire les dialogues et à imaginer l'histoire, c'étais très drôle d'imaginer comment les personnages allaient réagir à certaines situations.

Au final, je suis content d'avoir pu participer à ce concours et je me suis bien amusé à dévelloper un jeu-vidéo pour la première fois. J'espère que vous allez vous amuser en le testant!
