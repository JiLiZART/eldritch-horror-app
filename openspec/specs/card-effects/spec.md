# card-effects Specification

## Purpose
Let the players apply the text of encounter, mythos and monster cards to the game by hand: health, sanity, clues, gates and cards. Source: `inspired/manual_eng.pdf` p.3–4 "Gaining Cards", "Health and Sanity", "Clues", "Gates", "Double-sided cards"; `inspired/EH_reference.pdf` p.3, p.4, p.9, p.13.

## Requirements

### Requirement: Card text is applied in the Encounter and Mythos phases
Effects SHALL be applied to a standing investigator during the Encounter phase and during the Mythos phase once the mythos card is resolved. An effect in the Action phase, on a defeated investigator, or after the game is lost SHALL be refused with the rule named. Each applied effect SHALL be written to the phase log in rule words.

#### Scenario: Encounter text
- **WHEN** Leo Anderson has an America card showing and gains 1 clue
- **THEN** the log says Leo Anderson gains 1 clue

#### Scenario: Action phase refused
- **WHEN** an effect is applied during the Action phase
- **THEN** it is refused because card text is applied in the Encounter and Mythos phases

#### Scenario: Defeated investigator
- **WHEN** an effect is applied to a defeated investigator
- **THEN** it is refused because a defeated investigator cannot be affected

### Requirement: Health and sanity change by card text
An investigator SHALL gain or lose health or sanity by an amount; gains SHALL stop at the sheet maximum, and a loss that reaches 0 SHALL defeat the investigator at once by the defeat rule. **Deviation**: effects that prevent a loss are left to the players.

#### Scenario: Gain at the maximum
- **WHEN** Leo Anderson at 5 of 6 health gains 2 health
- **THEN** he has 6 health

#### Scenario: Loss defeats
- **WHEN** Lily Chen at 2 sanity loses 2 sanity at doom 12
- **THEN** she is defeated by sanity and doom is 11

### Requirement: Clues are gained and spent
Gaining 1 clue SHALL take the clue token on the investigator's space when one lies there, else the top token of the clue pool, the clue discard reshuffled in first when the pool is empty; with no token anywhere the gain SHALL be refused. Spending 1 clue SHALL be refused when the investigator holds none; a spent clue token SHALL join the clue discard, from where an empty pool is rebuilt.

#### Scenario: Token on the space
- **WHEN** Lily Chen on Shanghai with a clue token there gains 1 clue
- **THEN** she holds 1 more clue and no clue token lies on Shanghai

#### Scenario: From the pool
- **WHEN** Leo Anderson on a space without a clue token gains 1 clue with 20 tokens in the pool
- **THEN** he holds 1 more clue and 19 tokens remain in the pool

#### Scenario: No clue anywhere
- **WHEN** an investigator gains 1 clue with an empty pool and discard and no token on the space
- **THEN** the gain is refused because no clue can be gained

#### Scenario: Spend without clues
- **WHEN** an investigator holding 0 clues spends 1 clue
- **THEN** it is refused because the investigator holds no clue

#### Scenario: Spent clue discarded
- **WHEN** Leo Anderson spends a clue
- **THEN** one clue token lies on the clue discard and the pool is unchanged

### Requirement: A gate on the space is closed
Closing a gate SHALL discard the gate token on the investigator's space to the gate discard; monsters on the space stay. Closing with no gate on the space SHALL be refused.

#### Scenario: Gate closed
- **WHEN** Leo Anderson on Arkham with a gate there closes the gate
- **THEN** no gate stands on Arkham, Arkham is on top of the gate discard, and any monster on Arkham stays

#### Scenario: No gate
- **WHEN** an investigator on a space without a gate closes a gate
- **THEN** it is refused because no gate stands on the space

### Requirement: Cards are gained and discarded
Gaining a card from a deck SHALL take the top card of the asset or artifact deck, the bottom card of the spell or condition deck, or the first card of that deck matching a given name; an empty asset or artifact deck SHALL first be rebuilt by shuffling its discard; a spell or condition whose name the investigator already holds SHALL be refused, and a deck with nothing to draw or an absent name SHALL be refused naming the deck. Assets, artifacts and spells join the investigator's possessions; conditions are held apart and SHALL NOT be traded. Discarding a held card SHALL put an asset on the asset discard, an artifact on the artifact discard, and shuffle a spell or condition back into its deck. **Deviation**: card text, including "flip this card", is left to the players.

#### Scenario: Random spell
- **WHEN** Leo Anderson gains a spell with no name given
- **THEN** he holds the former bottom card of the spell deck

#### Scenario: Named condition
- **WHEN** Lily Chen gains the Cursed condition
- **THEN** she holds Cursed, listed among her conditions, and the condition deck holds one Cursed fewer

#### Scenario: Duplicate refused
- **WHEN** Lily Chen holding Cursed gains the Cursed condition
- **THEN** it is refused because she already has that condition

#### Scenario: Condition not tradeable
- **WHEN** Lily Chen trades her Cursed card to Leo Anderson on the same space
- **THEN** the trade is refused because conditions are not possessions

#### Scenario: Spell discarded
- **WHEN** Leo Anderson discards a held spell
- **THEN** it is back somewhere in the spell deck and not among his possessions

#### Scenario: Asset discarded
- **WHEN** Leo Anderson discards a held asset
- **THEN** it is on top of the asset discard

#### Scenario: Artifact deck rebuilt
- **WHEN** Leo Anderson gains an artifact while the artifact deck is empty and one artifact lies on its discard
- **THEN** he gains that artifact and the discard is empty

### Requirement: The effects are offered beside the board
During the Encounter phase and after the mythos card is resolved the players SHALL see, for a chosen standing investigator, controls to change health and sanity, gain and spend a clue, close the gate on their space, gain a card from a deck or by name, and discard a held card; and, for a chosen monster on the board, controls to move it to a named space, move it toward the nearest investigator and discard it; a refusal SHALL be explained in the rule's words, and each investigator's conditions SHALL be listed. The controls SHALL be grouped by what they touch: the investigator, their cards, the board, the monsters and the Ancient One; each group can be folded away and unfolded, the investigator group open at first, so the row of effects a card needs is found without scrolling past the rest.

#### Scenario: Controls shown
- **WHEN** Leo Anderson has an encounter card showing
- **THEN** the health, sanity, clue, gate and card controls are shown for him

#### Scenario: Monster controls shown
- **WHEN** a Byakhee stands on London while an encounter card is showing
- **THEN** the Byakhee on London can be chosen with Move, Toward nearest investigator and Discard controls

#### Scenario: Refusal explained
- **WHEN** Leo Anderson gains a clue with no clue anywhere
- **THEN** the panel says no clue can be gained

#### Scenario: Grouped
- **WHEN** Leo Anderson has an encounter card showing
- **THEN** the controls are offered under the investigator, cards, board, monsters and Ancient One groups, the investigator group open and the others folded

#### Scenario: Unfolded
- **WHEN** the players unfold the board group
- **THEN** the spawn and token controls are shown and the other groups stay as they were

### Requirement: An investigator is moved by card text
In the Encounter and Mythos phases a standing investigator SHALL be moved to any space the players name, without spending a ticket or an action; an unknown space SHALL be refused naming it. A move to a random space SHALL take the space printed on the top clue token of the pool, that token going to the clue discard, the discard being shuffled into an empty pool first; with no clue token anywhere the move SHALL be refused saying the lead investigator chooses the space instead. A move to the nearest space of a kind, or to the nearest space holding a gate or a clue, SHALL take the matching space at the smallest number of paths from the investigator, their own space counting first when it matches; with no matching space the move SHALL be refused naming what was sought. **Deviation**: among several nearest spaces the first in board order is taken instead of the active investigator's choice.

#### Scenario: Moved
- **WHEN** Leo Anderson on Buenos Aires is moved to Arkham by card text
- **THEN** his pawn stands on Arkham and the log says he moves to Arkham

#### Scenario: Unknown space
- **WHEN** an investigator is moved to a space not on the board
- **THEN** it is refused naming the space

#### Scenario: Random space
- **WHEN** Leo Anderson is moved to a random space by card text with London printed on the top clue token
- **THEN** he stands on London and that clue token lies on the clue discard

#### Scenario: No token for a random space
- **WHEN** a random move is called with an empty clue pool and discard
- **THEN** it is refused because the lead investigator chooses the space

#### Scenario: Nearest city
- **WHEN** Leo Anderson on Space 2 is moved to the nearest city by card text
- **THEN** he stands on San Francisco

#### Scenario: Already there
- **WHEN** Leo Anderson on Buenos Aires is moved to the nearest city
- **THEN** he stays on Buenos Aires and the log says so

#### Scenario: Nearest gate
- **WHEN** Leo Anderson on Buenos Aires is moved to the nearest space with a gate while the only gate stands on London
- **THEN** he stands on London

#### Scenario: Nothing matching
- **WHEN** Leo Anderson is moved to the nearest space with a clue while no clue lies on the board
- **THEN** it is refused because no space with a clue exists

### Requirement: A monster is moved by card text
In the Encounter and Mythos phases a monster on the board SHALL be moved to any space the players name, or 1 space toward the nearest standing investigator along a shortest route; a monster already on a space with a standing investigator SHALL stay where it is. A monster not on the board or an unknown space SHALL be refused naming it. The log SHALL say where the monster moves. **Deviation**: a tie among nearest investigators is broken by seat order, a tie among routes by board order, instead of the active investigator's choice; moving an epic monster is the players' call.

#### Scenario: Moved to a named space
- **WHEN** a Byakhee on London is moved to Arkham by card text
- **THEN** the Byakhee stands on Arkham and the log says it moves to Arkham

#### Scenario: Toward the nearest investigator
- **WHEN** a Byakhee on Arkham moves toward the nearest investigator while Leo Anderson is on London and Lily Chen on Shanghai
- **THEN** the Byakhee stands on London and the log says it moves to London

#### Scenario: Already with an investigator
- **WHEN** a Byakhee on London moves toward the nearest investigator while Leo Anderson is on London
- **THEN** the Byakhee stays on London and the log says it is already with Leo Anderson

#### Scenario: Not on the board
- **WHEN** a monster that is not on the board is moved
- **THEN** it is refused naming the monster

### Requirement: A monster is discarded by card text
In the Encounter and Mythos phases a monster on the board SHALL be discarded by card text: a non-epic monster is shuffled back into the monster cup, a set-aside monster is set aside again, an epic monster leaves the game. The log SHALL say where the monster went.

#### Scenario: Returns to the cup
- **WHEN** a Byakhee on London is discarded by card text
- **THEN** no Byakhee stands on London, the cup holds it, and the log says it returns to the cup

#### Scenario: Epic leaves the game
- **WHEN** an epic monster on Arkham is discarded by card text
- **THEN** it is neither on the board nor in the cup, and the log says it leaves the game

#### Scenario: Set aside again
- **WHEN** a Deep One spawned from the set-aside pile is discarded by card text
- **THEN** it is set aside again and not in the cup

### Requirement: Gates, clues and monsters are spawned by card text
In the Encounter and Mythos phases the players SHALL spawn a gate, a clue, or a monster on any space they name, by the same rules the Mythos icons follow: the gate opens from the top of the gate stack with 1 monster from the cup, the gate discard reshuffled in first and doom advancing by 1 instead when no token is left; the clue comes from the top of the pool, the clue discard reshuffled in first, none when both are empty; the monster is the top of the cup, moved where its token back says, none when the cup is empty; a monster spawned on a random space takes the space of the top clue token of the pool, that token going to the clue discard, and is refused with no clue token anywhere. Each spawn SHALL be logged, and the reshuffles SHALL follow the game seed. A set-aside monster of a named kind SHALL be spawned on any space the players name when one of that kind is still set aside, moved where its token back says; with every token of that kind on the board the spawn SHALL be refused naming the kind. **Deviation**: the space a card names is the players' reading; named monsters from the cup are not offered.

#### Scenario: Gate spawned
- **WHEN** card text spawns a gate with London on top of the stack
- **THEN** a gate stands on London with a monster from the cup beside it and the log says so

#### Scenario: Monster spawned on a named space
- **WHEN** card text spawns a monster on Buenos Aires
- **THEN** the top monster of the cup stands on Buenos Aires, or where its token back sends it

#### Scenario: Clue spawned
- **WHEN** card text spawns a clue
- **THEN** the top clue of the pool lies on its printed space

#### Scenario: Cup empty
- **WHEN** card text spawns a monster with an empty cup
- **THEN** no monster appears and the log says the cup is empty

#### Scenario: Monster on a random space
- **WHEN** card text spawns a monster on a random space with London printed on the top clue token
- **THEN** the monster spawns on London, or where its back sends it, and the token lies on the clue discard

#### Scenario: Set-aside monster spawned
- **WHEN** Cthulhu's text spawns a Deep One on Shanghai
- **THEN** the set-aside Deep One stands on Shanghai and one fewer monster is set aside

#### Scenario: None set aside
- **WHEN** a second Deep One is spawned with the only one on the board
- **THEN** it is refused because no Deep One is set aside

### Requirement: A monster ambushes the investigator
In the Encounter phase the encountering investigator SHALL fight the top monster of the cup at once when card text says a monster ambushes them: the monster is not spawned, so its token back does not move it and no spawn effect applies; the fight follows the combat rules; when the fight settles, defeated or not, the monster is shuffled back into the cup, and so it is when the investigator is defeated during the fight. With an empty cup the ambush SHALL be refused saying so. **Deviation**: an epic monster is never in the cup and never ambushes.

#### Scenario: Ambushed
- **WHEN** Leo Anderson on Buenos Aires is ambushed with a Color Out of Space on top of the cup
- **THEN** he fights it on Buenos Aires, not on Tunguska, and its Will dice wait

#### Scenario: Back in the cup
- **WHEN** Leo Anderson continues through an ambush the monster survives
- **THEN** the monster is in the cup and not on the board

#### Scenario: Defeated mid-ambush
- **WHEN** Leo Anderson is defeated by the ambushing monster's horror
- **THEN** the monster is in the cup and not on the board

#### Scenario: Empty cup
- **WHEN** an ambush is called with an empty cup
- **THEN** it is refused because the monster cup is empty

### Requirement: A defeated investigator's possessions are collected
While resolving a defeated investigator's encounter the encountering investigator SHALL be able to take every possession set aside with that sheet; a second take SHALL be refused because nothing is left. **Deviation**: whether the sheet back grants them is the players' reading.

#### Scenario: Collected
- **WHEN** Lily Chen takes the possessions of the defeated Leo Anderson during his encounter
- **THEN** Hired Muscle is among her possessions and none stays with his sheet
