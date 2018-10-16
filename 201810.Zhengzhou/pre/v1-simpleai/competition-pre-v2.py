import random
import decimal as d
from tqdm import tqdm
import matplotlib.pyplot as plt
from collections import Counter

QUESTION_AMOUNT = 100

class Test:
    def __init__(self):
        self.answers = [random.randint(0, 4) for _ in range(QUESTION_AMOUNT)]
    
    def check_answer(self, query):
        score = 0
        for index in range(QUESTION_AMOUNT):
            if query[index] == self.answers[index]:
                score += 1
            else:
                pass
        return score

test = Test()

class TestTaker:
    def __init__(self):
        self.answers = [random.randint(0, 4) for _ in range(QUESTION_AMOUNT)]
        self.score = test.check_answer(query=self.answers)

if __name__ == "__main__":
    all_takers_result = []
    takers_result = []
    for _ in range(1000):
        test_taker = TestTaker()
        takers_result.append(test_taker)
        all_takers_result.append(test_taker)
    takers_result = sorted(takers_result, key=lambda x: x.score, reverse=True)[0:500]
    for iteration in tqdm(range(1000)):
        for _ in range(500):
            test_taker = TestTaker()
            takers_result.append(test_taker)
            all_takers_result.append(test_taker)
        takers_result = sorted(takers_result, key=lambda x: x.score, reverse=True)[0:500]
    print(f"Top 500 Test Takers' Score: {[taker.score for taker in takers_result]}")
    # print(f"All Test Takers Result: {[taker.score for taker in all_takers_result]}")
    all_takers_result = [int(x.score) for x in all_takers_result]
    all_takers_result = Counter(all_takers_result)
    plt.scatter([int(x) for x in all_takers_result.keys()], [int(y) for y in all_takers_result.values()])
    plt.show()
    

