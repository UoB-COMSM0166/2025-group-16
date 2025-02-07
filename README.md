# 2025-group-16

2025 COMSM0166 group 16

## Our Game

Link to your game [PLAY HERE](https://uob-comsm0166.github.io/2025-group-16/)

Your game lives in the [/docs](/docs) folder, and is published using Github pages to the link above.

Include a demo video of your game here (you don't have to wait until the end, you can insert a work in progress video)

## Our Game List

| **Name**                   | **Introduction**                                                                                                                                                               | **Feasibility / Challenges**                                                                                                                                                          |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Unspottable**            | Multiple players join a party game where their goal is to blend in with robots and try to identify and beat other players among the robots.                                    | **Feasibility:** ★★★☆☆ <br> - Algorithm for robot behavior. <br> - Convert 3D to 2D. <br> - Support simultaneous player controls.                                                     |
| **Taiko no Tatsujin**      | A rhythm music game where you choose your favorite song and score points by hitting notes with perfect timing as they reach the target spots.                                  | **Feasibility:** ★★★★☆ <br> - Sync controls, music, and visuals. <br> - Convert music to beat points.                                                                                 |
| **Scream Chicken Jumpy**   | Control the chicken with your voice to move through obstacles and aim for the longest distance.                                                                                | **Feasibility:** ★★★☆☆ <br> - Voice detection mechanism. <br> - Overlay game graphics on player video. <br> - Record and replay gameplay.                                             |
| **Super Bunny Man**        | A co-op physics platformer where players control a rabbit-costumed character. Team up locally or online to beat levels, find carrots, and race against the clock.              | **Feasibility:** ★☆☆☆☆ <br> - 3D to 2D transition may affect smoothness.                                                                                                              |
| **PICO PARK**              | A cooperative puzzle game where players work together to solve unique challenges, compete in mini-games, or survive as long as possible to achieve high scores.                | **Feasibility:** ★★★★☆ <br> - Puzzles for cooperative play. <br> - Handle latency, sync, and disconnections. <br> - Infinite map generation.                                          |
| **Pikachu Volleyball**     | A single-player or two-player game where characters move back and forth to catch the ball or jump to attack and block. Points are scored when the ball lands on the ground.    | **Feasibility:** ★☆☆☆☆ <br> - Calculate bounce based on position and attributes. <br> - Design 2D animations for different scenarios.                                                 |
| **Gang Beasts**            | A hilarious multiplayer party game with chaotic gameplay. Modes include Melee (free-for-all fights), Gang (team battles), and Waves (co-op against AI enemies).                | **Feasibility:** ★☆☆☆☆ <br> - Mechanics require time to master. <br> - Creating strong yet soft characters is challenging.                                                            |
| **King of Fighters**       | Up to 4 players can battle using a single keyboard. Modes include: versus, campaign, tournament, and War.                                                                      | **Feasibility:** ★☆☆☆☆ <br> - Many characters with unique skills. <br> - Actions and items need to be combined. <br> - Complex keyboard controls. <br> - NPC enemies appear randomly. |
| **Ultimate Chicken Horse** | A party game where players build routes and place obstacles to challenge each other. Use simple movements to reach the goal while trying to block others.                      | **Feasibility:** ★☆☆☆☆ <br> - Simultaneous controls for players. <br> - Complex scoring system. <br> - Issues with block and obstacle combinations.                                   |
| **King of Opera**          | A party game where characters continuously spin while idle. Players only need to control the forward button and try to knock others off by pushing them to fall from the edge. | **Feasibility:** ★☆☆☆☆ <br> - 3D to 2D transition may affect smoothness. <br> - Sliding-back effect needed on hit. <br> - Precise reactions for consecutive collisions.               |
| **Ghost Invaders**         | A Space Invaders-inspired game featuring multiplayer controls for movement and shooting, with quick access to the menu and restart options.                                    | **Feasibility:** ★☆☆☆☆ <br> - Excessive repetition. <br> - Difficulty imbalance affects player retention.                                                                             |

## Two Prototype Ideas GIFs

![Prototype Idea 1](DEMO%201.gif)
![Prototype Idea 2](DEMO%202.gif)

1. <a href="https://youtu.be/sJq6Dhigx1E"><b>Unspottable</b></a>
2. <a href="https://youtu.be/9nLy-XZOiaM"><b>Taiko no Tatsujin</b></a>

## Idea - Unspottable / Taiko no Tatsujin

<a href="https://store.steampowered.com/app/1243960/Unspottable/"><b>Unspottable</b></a>

Multiple players join a party game where they blend in with a crowd of robots while identifying and hunting down the other human players hidden among them, under various environmental rules.

Feasibility / Difficulty

1. Develop an algorithm to make robots behave like real players.
2. Convert 3D visual elements into a 2D style.
3. Implement simultaneous controls for multiple players (single-player mode is not supported).
4. Synchronize player actions and robot actions to ensure smooth gameplay.

Features

1. Simple controls: move, attack, run, and disturb.
2. Realistic robots involved.
3. Diverse maps with unique rules.
4. Customizable score system.

Twists / Stages

1. Basic Gameplay: 2-player simplest mode. Robots have no special behavior. Basic controls include: up, right, down, left, and hit.
2. More Maps: Add multiple maps with unique rules, such as Gym, Battlefield, Theater, and Nightclub.
3. More Controls: Introduce additional controls like running and disturbing, making the game more dynamic.
4. More Players: Support up to 4 local players.
5. Score System: Implement a scoring system where players set a target score to win.
6. Online Mode: Allow players to compete online with matchmaking or room creation.
7. Facial Recognition Control: Use facial recognition to control the direction of movement in the game, providing a more intuitive and fun way to interact with the game.

Simulation preview from p5js:
![alt text](image-simulationPic.png)

<a href="https://www.youtube.com/watch?v=perKCVKo-Mc"><b>Taiko no Tatsujin</b></a>

A rhythm music game where players choose their favorite song and score points by hitting notes with perfect timing as they reach the target spots on the screen. The better the timing, the higher the score.

Feasibility / Difficulty

1. Controls, music, and visuals must be perfectly synced for providing an engaging experience..
2. Transform songs into beat points for gameplay.

Features

1. Simple Controls: Only 2 buttons are needed.
2. Multiplayer & Score System: Support multiple players and track scores.
3. Multiple Songs & Levels: Offer a variety of songs with multiple level options of each.

Twists / Stages

1. Basic Gameplay: Playable with keyboard and only one song.
2. Start Screen: Add a start page before gameplay.
3. Song Selection: Allow players to choose from three or more songs.
4. Motion Detection: Add a motion-based gameplay mode.
5. Multiplayer: Add a two-player versus mode.
6. Custom Songs: Enable players to import music and auto-generate rhythm points.
7. Visual Recognition for Drumming Action: Integrate image recognition to track players' drumming actions in the air, increasing immersion and making the experience more interactive.

## Your Group

![alt text](image.png)

- Group member 1, Yun-Fan Hsin, lt24003@bristol.ac.uk, hsinyunF
- Group member 2, Yu-Qi Lin, rk24876@bristol.ac.uk, chiderlin
- Group member 3, Wei Lin, tr24015@bristol.ac.uk, vivi2393142
- Group member 4, Digo Tu, ma24030@bristol.ac.uk, digotu
- Group member 5, Zih-Cing Lan, aw24252@bristol.ac.uk, ZihcingLan
- Group member 6, Pin-Ru Chen , tz24192@bristol.ac.uk, nezii0331

## Project Report

### Introduction

- 5% ~250 words
- Describe your game, what is based on, what makes it novel?

### Requirements

#### Stakeholder List

- User

- Developer

- Supervisor

- Competitor

#### Epics and User Stories

Please find all the tasks on our [Jira](https://vivi2393142-0702.atlassian.net/jira/software/projects/TG/boards/2/timeline), or check our documentations through the [link](https://vivi2393142-0702.atlassian.net/wiki/x/OoBm).

#### Reflection

- 15% ~750 words
- Use case diagrams, user stories. Early stages design. Ideation process. How did you decide as a team what to develop?

### Design

- 15% ~750 words
- System architecture. Class diagrams, behavioural diagrams.

### Implementation

- 15% ~750 words

- Describe implementation of your game, in particular highlighting the three areas of challenge in developing your game.

### Evaluation

- 15% ~750 words

- One qualitative evaluation (your choice)

- One quantitative evaluation (of your choice)

- Description of how code was tested.

### Process

- 15% ~750 words

- Teamwork. How did you work together, what tools did you use. Did you have team roles? Reflection on how you worked together.

#### Github Workflow

Please find the link to check our [workflow](https://vivi2393142-0702.atlassian.net/wiki/spaces/TP/pages/8159293/GitHub+Workflow+Guideline).

#### Kanban, Meeting Minutes & Documentation

Our project management and documents are on Atlassian Jira. As the free plan doesn't support public sharing, please use the credentials below to access them.

**Access Links**

- [🔗 Jira Kanban Board](https://vivi2393142-0702.atlassian.net/jira/software/projects/TG/boards/2)
- [📄 Meeting Records & Documents](https://vivi2393142-0702.atlassian.net/wiki/spaces/TP/overview)

**Access Credentials**

- Email: team16_access@outlook.com
- Password: team16_password

Alternatively, if you prefer to use your own account, please request access from us.

### Conclusion

- 10% ~500 words

- Reflect on project as a whole. Lessons learned. Reflect on challenges. Future work.

### Contribution Statement

- Provide a table of everyone's contribution, which may be used to weight individual grades. We expect that the contribution will be split evenly across team-members in most cases. Let us know as soon as possible if there are any issues with teamwork as soon as they are apparent.

### Additional Marks

You can delete this section in your own repo, it's just here for information. in addition to the marks above, we will be marking you on the following two points:

- **Quality** of report writing, presentation, use of figures and visual material (5%)

  - Please write in a clear concise manner suitable for an interested layperson. Write as if this repo was publicly available.

- **Documentation** of code (5%)

  - Is your repo clearly organised?
  - Is code well commented throughout?
