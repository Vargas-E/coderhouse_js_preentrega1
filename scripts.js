let log = "";

const changeInnerHTML = (id, property, value) => {
  document.getElementById(id)[property] = value;
};

const disableButtons = () => {
  changeInnerHTML("pokemon1attack1", "disabled", true);
  changeInnerHTML("pokemon1attack2", "disabled", true);
  changeInnerHTML("pokemon2attack1", "disabled", true);
  changeInnerHTML("pokemon2attack2", "disabled", true);
};

const checkSelectedPokemons = () => {
  if (selectedPokemon1 && selectedPokemon2) {
    changeInnerHTML("pokemon1attack1", "disabled", false);
    changeInnerHTML("pokemon1attack2", "disabled", false);
    changeInnerHTML("pokemon2attack1", "disabled", false);
    changeInnerHTML("pokemon2attack2", "disabled", false);
  }
};

const restartGame = () => {
  log = "";
  changeLog(log);
  selectedPokemon1 = null;
  selectedPokemon2 = null;
  changeInnerHTML("pokemonName1", "innerHTML", ``);
  changeInnerHTML("pokemonType1", "innerHTML", "");
  changeInnerHTML("pokemonHp1", "innerHTML", "");
  changeInnerHTML("pokemon1attackName1", "innerHTML", "");
  changeInnerHTML("pokemon1attackDescription1", "innerHTML", "");
  changeInnerHTML("pokemon1attackName2", "innerHTML", "");
  changeInnerHTML("pokemon1attackDescription2", "innerHTML", "false");
  changeInnerHTML("buttonPokemon1Confirm", "disabled", false);
  changeInnerHTML("pokemonImage1", "src", "./assets/pokeball.png");

  changeInnerHTML("pokemonName2", "innerHTML", ``);
  changeInnerHTML("pokemonType2", "innerHTML", "");
  changeInnerHTML("pokemonHp2", "innerHTML", "");
  changeInnerHTML("pokemon2attackName1", "innerHTML", "");
  changeInnerHTML("pokemon2attackDescription1", "innerHTML", "");
  changeInnerHTML("pokemon2attackName2", "innerHTML", "");
  changeInnerHTML("pokemon2attackDescription2", "innerHTML", "false");
  changeInnerHTML("buttonPokemon2Confirm", "disabled", false);
  changeInnerHTML("pokemonImage2", "src", "./assets/pokeball.png");
  disableButtons();
};

const changeLog = (text, combatEnd) => {
  let parsedText;
  if (combatEnd) {
    parsedText = `<p style="font-weight: bold;">${text}</p>`;
  }
  parsedText = `<p>${text}</p>`;
  log += parsedText;
  document.getElementById("log").innerHTML = `<p>${log}</p>`;
};

const typeDamageCorrections = [
  {
    type: "fire",
    advantages: ["grass"],
    disadvantages: ["water", "rock"],
  },
  {
    type: "grass",
    advantages: ["water"],
    disadvantages: ["fire"],
  },
  {
    type: "water",
    advantages: ["grass"],
    disadvantages: ["electric"],
  },
  {
    type: "electric",
    advantages: ["water"],
    disadvantages: ["rock"],
  },
  {
    type: "rock",
    advantages: ["electric"],
    disadvantages: ["grass"],
  },
];

const typeCorrection = (dmg, attackType, objectiveType) => {
  const typeData = typeDamageCorrections.find((e) => e.type == objectiveType);
  if (typeData.advantages.includes(attackType)) {
    return Math.floor(dmg / 2);
  }
  if (typeData.disadvantages.includes(attackType)) {
    return Math.floor(dmg * 2);
  }
  return dmg;
};

class Pokemon {
  constructor(pokemonData) {
    this.name = pokemonData.name;
    this.level = pokemonData.level;
    this.maxHp = pokemonData.maxHp;
    this.hp = pokemonData.hp;
    this.attacks = pokemonData.attacks;
    this.type = pokemonData.type;
    this.pic = pokemonData.pic;
  }

  updateAttackLog(attack, damage) {
    if (attack.damage < damage) {
      changeLog(`${this.name} uses ${attack.name}!! It's super effective!`);
    }
    if (attack.damage > damage) {
      changeLog(
        `${this.name} uses ${attack.name}!! It's not very effective...`
      );
    }
    if (attack.damage == damage) {
      changeLog(`${this.name} uses ${attack.name}!!`);
    }
  }

  attack(attackIndex, index) {
    const attack = this.attacks[attackIndex];
    let damage;

    if (index == 1) {
      damage = typeCorrection(
        attack.damage,
        attack.type,
        selectedPokemon2.type
      );
      this.updateAttackLog(attack, damage);
      selectedPokemon2.loseHp(damage, index);
    } else {
      damage = typeCorrection(
        attack.damage,
        attack.type,
        selectedPokemon1.type
      );
      this.updateAttackLog(attack, damage);
      selectedPokemon1.loseHp(damage, index);
    }
  }

  gainHp(value) {
    if (value + this.hp > this.maxHp) {
      this.hp = this.maxHp;
    } else {
      this.hp = value + this.hp;
    }
  }

  loseHp(value, index) {
    let newValue = this.hp - value;
    if (newValue < 1) {
      newValue = 0;
    }
    this.hp = newValue;
    if (index == 1) {
      document.getElementById(
        "pokemonHp2"
      ).innerHTML = `Hp: ${this.hp}/${this.maxHp}`;
      if (this.hp == 0) {
        changeLog(
          `${selectedPokemon1.name} deals ${value} damage!!! ${selectedPokemon2.name} has fainted!`
        );
        changeLog(`${selectedPokemon1.name} won!!`, true);
        disableButtons();
      } else {
        changeLog(`${selectedPokemon1.name} deals ${value} damage!!!`);
      }
    } else {
      document.getElementById(
        "pokemonHp1"
      ).innerHTML = `Hp: ${this.hp}/${this.maxHp}`;
      if (this.hp == 0) {
        changeLog(
          `${selectedPokemon2.name} deals ${value} damage!!! ${selectedPokemon1.name} has fainted!`
        );
        changeLog(`${selectedPokemon2.name} won!!`, true);

        disableButtons();
      } else {
        changeLog(`${selectedPokemon2.name} deals ${value} damage!!!`);
      }
    }
  }

  returnFullPokemon() {
    return this;
  }
}

let selectedPokemon1;
let selectedPokemon2;

const selectPokemon1 = (value) => {
  let pokemon;
  for (const poke of pokemonDb) {
    if (value == poke.name) {
      pokemon = new Pokemon(poke);
    }
  }
  selectedPokemon1 = new Pokemon(pokemon);
  if (selectedPokemon1) {
    changeInnerHTML("pokemonName1", "innerHTML", `${selectedPokemon1.name}`);
    changeInnerHTML(
      "pokemonType1",
      "innerHTML",
      `Type: ${selectedPokemon1.type}`
    );
    changeInnerHTML(
      "pokemonHp1",
      "innerHTML",
      `Hp: ${selectedPokemon1.hp}/${selectedPokemon1.maxHp}`
    );
    changeInnerHTML(
      "pokemon1attackName1",
      "innerHTML",
      selectedPokemon1.attacks[0].name
    );
    changeInnerHTML(
      "pokemon1attackDescription1",
      "innerHTML",
      selectedPokemon1.attacks[0].description
    );
    changeInnerHTML(
      "pokemon1attackName2",
      "innerHTML",
      selectedPokemon1.attacks[1].name
    );
    changeInnerHTML(
      "pokemon1attackDescription2",
      "innerHTML",
      selectedPokemon1.attacks[1].description
    );
    changeInnerHTML("buttonPokemon1Confirm", "disabled", true);
    changeInnerHTML("pokemonImage1", "src", selectedPokemon1.pic);
    changeLog(`Player 1 selected ${pokemon.name}`);
    checkSelectedPokemons();
  }
};

const selectPokemon2 = (value) => {
  let pokemon;
  for (const poke of pokemonDb) {
    if (value == poke.name) {
      pokemon = new Pokemon(poke);
    }
  }
  selectedPokemon2 = new Pokemon(pokemon);
  if (selectedPokemon2) {
    changeInnerHTML("pokemonName2", "innerHTML", `${selectedPokemon2.name}`);
    changeInnerHTML(
      "pokemonType2",
      "innerHTML",
      `Type: ${selectedPokemon2.type}`
    );
    changeInnerHTML(
      "pokemonHp2",
      "innerHTML",
      `Hp: ${selectedPokemon2.hp}/${selectedPokemon2.maxHp}`
    );
    changeInnerHTML(
      "pokemon2attackName1",
      "innerHTML",
      selectedPokemon2.attacks[0].name
    );
    changeInnerHTML(
      "pokemon2attackDescription1",
      "innerHTML",
      selectedPokemon2.attacks[0].description
    );
    changeInnerHTML(
      "pokemon2attackName2",
      "innerHTML",
      selectedPokemon2.attacks[1].name
    );
    changeInnerHTML(
      "pokemon2attackDescription2",
      "innerHTML",
      selectedPokemon2.attacks[1].description
    );
    changeInnerHTML("buttonPokemon2Confirm", "disabled", true);
    changeInnerHTML("pokemonImage2", "src", selectedPokemon2.pic);
    changeLog(`Player 2 selected ${pokemon.name}`);
    checkSelectedPokemons();
  }
};

const pokemonDb = [
  {
    name: "Charmander",
    level: 1,
    maxHp: 20,
    hp: 20,
    attacks: [
      {
        name: "ember",
        damage: 5,
        type: "fire",
        description: "Active pokemon throws a little fireball",
      },
      {
        name: "tacle",
        damage: 4,
        type: "normal",
        description: "Active pokemon shoves the opponent with its body",
      },
    ],
    type: "fire",
    pic: "./assets/charmander.png",
  },
  {
    name: "Pikachu",
    level: 1,
    hp: 16,
    maxHp: 16,
    attacks: [
      {
        name: "thunderbolt",
        damage: 6,
        type: "electric",
        description: "Active pokemon attacks with a surge of electricity",
      },
      {
        name: "tacle",
        damage: 4,
        type: "normal",
        description: "Active pokemon shoves the opponent with its body",
      },
    ],
    type: "electric",
    pic: "./assets/pikachu.png",
  },
  {
    name: "Bulbasaur",
    level: 1,
    hp: 24,
    maxHp: 24,
    attacks: [
      {
        name: "cut",
        damage: 4,
        type: "normal",
        description: "Active pokemon attacks with claws",
      },
      {
        name: "vine whip",
        damage: 6,
        type: "grass",
        description: "Active pokemon attacks with vines",
      },
    ],
    type: "grass",
    pic: "./assets/bulbasaur.png",
  },
  {
    name: "Squirtle",
    level: 1,
    hp: 24,
    maxHp: 24,
    attacks: [
      {
        name: "tacle",
        damage: 5,
        type: "normal",
        description: "Active pokemon shoves the opponent with its body",
      },
      {
        name: "water gun",
        damage: 6,
        type: "water",
        description: "Active pokemon shoots a stream of pressured water",
      },
    ],
    type: "water",
    pic: "./assets/squirtle.png",
  },
  {
    name: "Geodude",
    level: 1,
    hp: 24,
    maxHp: 24,
    attacks: [
      {
        name: "rock throwr",
        damage: 5,
        type: "rock",
        description: "Active pokemon throws a rock",
      },
      {
        name: "bash",
        damage: 5,
        type: "normal",
        description: "Active pokemon throws a punch",
      },
    ],
    type: "rock",
    pic: "./assets/geodude.png",
  },
];
