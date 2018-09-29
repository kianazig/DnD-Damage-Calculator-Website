/**
* Contains the JavaScript functions necessary for the Dungeons &
* Dragons Damage Calculator website. 
*
* Takes the user input from the HTML form and uses it to 
* generate calculations, which are then sent to the proper HTML
* table elements.
* 
* @author Kiana Ziglari
* Last Updated: September 25, 2018
*/

/**
* Retrieves all form information and calls the appropriate functions
* to calculate data which is then sent to the appropriate locations
* in the HTML table.
*/
function fillTable(){

	//User's to hit bonus. Affects their chance of hititng.
	var toHit = document.getElementById("toHit").value;

	//The amount of damage dice to be rolled.
	var numOfDice = document.getElementById("numOfDice").value;

	//The type of damage dice to be rolled (how many sides).
	var typeOfDice = document.getElementById("typeOfDice").value;

	//The bonus that's added to damage rolled.
	var damageBonus = document.getElementById("damageBonus").value;

	//True if rolling at advantage.
	var advantage = document.getElementById("advantage").checked;

	//True if rolling at disadvantage.
	var disadvantage = document.getElementById("disadvantage").checked;

	//The HTML table that results will be displayed on.
	//Row 2 of the table represents the chance of hitting, Row 3 of the table
	//represents the average damage per turn.
	var table = document.getElementById("table1");

	//An array that holds the value of all target Armor Classes (AC).
	var armor = [table.rows[0].cells.length - 1];

	//Fills the array armor with the appropriate ACs from Row 1 of the HTML table.
	for(var i=1; i<table.rows[0].cells.length; i++){
		armor[i-1] = table.rows[0].cells[i].innerHTML;
	}

	//An array that represents the chance of hitting (in percentage) different Armor Classes (AC).
	var chanceOfHit = getChanceOfHit(toHit, advantage, disadvantage, armor);

	//The average damage that would be done assuming the user hits.
	var averageDamage = getAverageDamage(numOfDice, typeOfDice, damageBonus, chanceOfHit, advantage, disadvantage);

	//Fills Row 2 of the table with the Chance of Hititng.
	for (var i=1; i<table.rows[1].cells.length; i++){
		table.rows[1].cells[i].innerHTML = chanceOfHit[i-1].toFixed(2)+'%';
	}

	//Fills Row 3 of the table with the Average Damage Per Turn.
	for (var i=1; i<table.rows[2].cells.length; i++){
		table.rows[2].cells[i].innerHTML = (averageDamage[i-1]).toFixed(2);
	}
}

/**
* Calculates the chance of hitting a collection of different Armor Classes (AC).
*
* To determine if an attack hits, a 20 sided die is rolled. The toHit
* bonus is then added to the result of the roll. If the total is greater
* than or equal to the target AC, the attack successfully hits. 
* Rolling a 1 automatically counts as a miss.
*
* If rolling at advantage, two 20 sided die are rolled. The result of the
* higher roll is used.
* If rolling at disadvantage, two 20 sided die are rolled. The result of
* the lower roll is used.
* If rolling at both advantage and disadvantage, it is treated as a single
* regular roll. 
*
* @param {int} 		toHit 			The user's to hit bonus. 
* @param {boolean}	advantage		True if rolling at advantage.
* @param {boolean}	disadvantage	True if rolling at disadvantage.
* @param {int[]}	armor 			The collection of target ACs.
*
* @return {int[]}	chanceOfHit 	The chance of hitting (as a percentage) target ACs.
*/
function getChanceOfHit(toHit, advantage, disadvantage, armor){
	var chanceOfHit = [armor.length]; //An array to store the chances of hitting that correllate with the ACs from armor.
	var hits; //Keeps track of the amount of dice rolls that would hit [0,20].

	if ( !(advantage||disadvantage) || (advantage&&disadvantage) ){ //regular roll
		for(var i=0; i<armor.length; i++){
			hits = 20-(armor[i]-toHit)+1;
			chance = (hits/20.0)*100;
			if (chance > 95){ //Since a 1 automatically misses, chance of hit cannot be greater than 95%.
				chance = 95;
			}
			else if (chance < 0){ //Chance of hitting cannot be less than 0%.
				chance = 0;
			}
			chanceOfHit[i] = chance;
		}
	}
	else if (advantage){ //roll at advantage
		for(var i=0; i<armor.length; i++){
			//P(A or B) = P(A) + P(B) - P(A and B)
			//P(A and B) = P(A)*P(B)

			hits = (20-(armor[i]-toHit)+1);
			
			var singleRollChance = (hits/20.0);

			if (singleRollChance > 0.95){ //Since a 1 automatically misses, chance of hit cannot be greater than 95%.
				singleRollChance = 0.95;
			}
			else if (singleRollChance<0){ //Chance of hitting cannot be less than 0%.
				singleRollChance = 0;
			}

			var chance = (singleRollChance + singleRollChance - (singleRollChance*singleRollChance))*100;

			chanceOfHit[i] = chance;
		}
	}
	else if (disadvantage){ //roll at disadvantage
		for(var i=0; i<armor.length; i++){
			//P(A and B) = P(A)*P(B)

			hits = (20-(armor[i]-toHit)+1);
			
			var singleRollChance = (hits/20.0);
			var singleRollChance = singleRollChance;


			if (singleRollChance>0.95){ //Since a 1 automatically misses, chance of hit cannot be greater than 95%.
				singleRollChance = 0.95;
			}
			else if (singleRollChance<0){ //Chance of hitting cannot be less than 0%.
				singleRollChance = 0;
			}

			var chance = ((singleRollChance*singleRollChance))*100;

			chanceOfHit[i] = chance;
		}
	}
	return chanceOfHit;
}

/**
* Calculates the average damage per turn that would be done for a range of target ACs.
*
* To determine how much damage is done on a single hit, any amount of any different types
* of dice may be rolled. A damage bonus is then added to the result of the rolls.
*
* If the roll to hit was a 20 (a crit), double the amount of damage dice are rolled instead.
* The damage bonus is still only added once.
*
* @param {int}		numOfDice		The amount of dice to be rolled.
* @param {int}		typeOfDice		The type of dice to be rolled (how many sides).
* @param {int}		damageBonus		The bonus amount to be added to the dice rolls.
* @param {int[]}	chanceOfHit 	The chance of hitting (as a percentage) target ACs.
* @param {boolean}	advantage		True if attack is at advantage.
* @param {boolean}	disadvantage	True if attack is at disadvantage.
*
* @return {int[]}	averageDamage 	The average damage per turn for a range of target ACs.
*/
function getAverageDamage(numOfDice, typeOfDice, damageBonus, chanceOfHit, advantage, disadvantage){

	//Damage that is done on a dice roll that hits, as long as the roll isn't 20.
	var regularDamage=0;

	//Damage that is done if a 20 is rolled to hit. 
	var critDamage=0;

	//The average damage per turn for the correlating ACs in armor.
	var averageDamage=[chanceOfHit.length];

	//The average result when rolling an n sided die is n/2 + 0.5.
	regularDamage = ((typeOfDice/2.0)+0.5)*numOfDice + +damageBonus;
	critDamage = (regularDamage-damageBonus)*2.0 + +damageBonus; //Double the amount of dice are rolled.

	var regularDamagePerTurn = 0;
	var critDamagePerTurn = 0;

	if ( !(advantage||disadvantage) || (advantage&&disadvantage) ){ //regular roll
		for (var i=0; i<chanceOfHit.length; i++){
			if(chanceOfHit[i]>5){ //5% of the time, damage dealt will be crit damage.
				regularDamagePerTurn = regularDamage*((chanceOfHit[i]-5)/100.0);
				critDamagePerTurn = critDamage*0.05;
			}
			else if (chanceOfHit[i]==5){ //Only 20s will hit, so only crit damage will be dealt.
				regularDamagePerTurn = 0;
				critDamagePerTurn = critDamage*0.05;
			}
			else if (chanceOfHit[i]==0){//No damage will be dealt.
				regularDamagePerTurn = 0;
				critDamagePerTurn = 0;
			}
		averageDamage[i] = regularDamagePerTurn + critDamagePerTurn;
		}
	}
	else if (advantage){ //roll at advantage
		for (var i=0; i<chanceOfHit.length; i++){
			if(chanceOfHit[i]>9.75){ //9.75% of the time, damage dealt will be crit damage.
				regularDamagePerTurn = regularDamage*((chanceOfHit[i]-9.75)/100.0);
				critDamagePerTurn = critDamage*0.0975;
			}
			else if (chanceOfHit[i]==9.75){ //Only 20s will hit, so only crit damage will be dealt.
				regularDamagePerTurn = 0;
				critDamagePerTurn = critDamage*0.0975;
			}
			else if (chanceOfHit[i]==0){//No damage will be dealt.
				regularDamagePerTurn = 0;
				critDamagePerTurn = 0;
			}
		averageDamage[i] = regularDamagePerTurn + critDamagePerTurn;
		}
	}
	else if (disadvantage){ //roll at disadvantage
		for (var i=0; i<chanceOfHit.length; i++){
			if(chanceOfHit[i]>.25){ //.25% of the time, damage dealt will be crit damage.
				regularDamagePerTurn = regularDamage*((chanceOfHit[i]-.25)/100.0);
				critDamagePerTurn = critDamage*0.0025;
			}
			else if (chanceOfHit[i]==.25){ //Only 20s will hit, so only crit damage will be dealt.
				regularDamagePerTurn = 0;
				critDamagePerTurn = critDamage*0.0025;
			}
			else if (chanceOfHit[i]==0){//No damage will be dealt.
				regularDamagePerTurn = 0;
				critDamagePerTurn = 0;
			}
		averageDamage[i] = regularDamagePerTurn + critDamagePerTurn;
		}
	}
	return averageDamage;
}