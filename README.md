# DnD-Damage-Calculator-Website
Allows the user to input data and uses it to calculate the chance of hitting and average damage per turn during an attack.


Uses an HTML form to allow the user to input the following data:
To Hit Bonus: the user's bonus they add to their roll to hit
Damage Dice: the dice the user rolls to determine how much damage is done (Ex: rolling one die with 6 sides = rolling 1D6)
Damage Bonus: the number that is added to the result obtained from the damage dice
Advantage: if the user rolls at advantage, two 20-sided die are rolled and the value of the higher roll is taken
Disadvantage: if the user rolls at disadvantage, two 20 sided die are rolled and the value of the lower roll is taken

Outputs the following data:
Chance of Hitting: the chance of hitting armor classes 10-25
Average Damage Per Turn: the average damage that would be done per turn for armor classes 10-25. critical hit damage is included in this calculation.


D&D Combat Rules
- Determining if an attack hits
    - A 20 sided die (D20) is rolled to determine if the user hits. The player's to hit bonus is added to this roll. The enemy being targeted has a numeric value that represents their armor class (AC). To successfully hit the enemy, the players roll plus their to hit bonus must be greater than or equal to the enemy's AC.
    - Advantage: if a player is rolling at advantage, two 20-sided die are rolled and the value of the higher roll is taken
    - Disadvantage: if the user rolls at disadvantage, two 20 sided die are rolled and the value of the lower roll is taken
- Determining how much damage is done
    - The player rolls n amount of x-sided dice. They then add their damage bonus to the result of the roll.
    - If the to hit roll was a 20, this is considered a critical hit. Double the damage dice are rolled, but the damage bonus is still added only once. On a regular hit, their is a 5% chance of rolling a crit, with advantage there is a 9.75% chance of rolling a crit, and with disadvantage there is a .25% chance of rolling a crit.
