import numpy as np
from tqdm import tqdm


class Boss:
    """
    Creates a Boss that has the following 3 attributes:
      - Attack: The ability to create for the opponent
      - Defend: The ability to defend from opponent's attack
      - Health: The remaining capability of fighting with the opponent
    """

    def __init__(self):
        self.attack = 25000
        self.defend = 75000
        self.health = 100000


class NPC:
    """
    Creates a NPC that has the following 3 attributes:
      - Attack: The ability to create for the opponent
      - Defend: The ability to defend from opponent's attack
      - Health: The remaining capability of fighting with the opponent
    """

    def __init__(self):
        attributes = np.random.dirichlet(np.ones(2), size=1)[0]
        self.attack = int(attributes[0] * 100000)
        self.defend = int(attributes[1] * 100000)
        self.health = self.initial_health = 100000
        self.opponent = None
        self.counter = 0

    def __int__(self):
        return self.counter

    def fight(self):
        self.opponent = Boss()
        while self.health > 0:
            # Now let's attack the boss
            self.opponent.health -= (self.opponent.defend / 100000) * self.attack
            self.counter += 1
            # Let the boss attack us
            self.health -= (self.defend / 100000) * self.opponent.attack

    def _get_boss(self):
        return self.opponent


if __name__ == '__main__':
    evolution_status = []
    for _ in range(1000):
        npc = NPC()
        npc.fight()
        evolution_status.append({"npc": npc, "boss": npc._get_boss()})
    evolution_status = sorted(evolution_status, key=lambda x: x['boss'].health, reverse=True)[0:500]
    for i in tqdm(range(200)):
        for _ in range(500):
            npc = NPC()
            npc.fight()
            evolution_status.append({"npc": npc, "boss": npc._get_boss()})
        evolution_status = sorted(evolution_status, key=lambda x: x['boss'].health, reverse=True)[0:500]
    result = sorted(evolution_status, key=lambda x: x['boss'].health)
    print(f"Winner Attack: {result[0]['npc'].attack}")
    print(f"Winner Defend: {result[0]['npc'].defend}")
    print(f"Winner Health: {result[0]['npc'].health}")
    print(f"Winner Counter: {int(result[0]['npc'])}")
    print("Winner Group Top 20:")
    for battle in result[0:20]:
        print(f"  -  NPC: {battle['npc'].attack} | {battle['npc'].defend} | {battle['npc'].initial_health} | "
              f"{battle['npc'].health} | {battle['npc'].counter} ||| Boss Health: {battle['boss'].health}")
