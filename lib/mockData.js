// Mock data for demo purposes

export const mockAIResponses = {
  "loop kya hai": {
    hinglish: "Loop ek aisa structure hai jo code ko baar baar chalata hai. Jaise agar tumhe 1 se 10 tak numbers print karne hain, toh ek loop use kar sakte ho instead of 10 baar print likhne ke.",
    timestamp: "2:30",
    codeExample: `for i in range(1, 11):
    print(i)`
  },
  "function kaise banate": {
    hinglish: "Function ek reusable code block hai. Python mein 'def' keyword se banate hain. Example dekho:",
    timestamp: "5:45",
    codeExample: `def greet(name):
    return f"Hello {name}!"

result = greet("Rahul")
print(result)`
  },
  "error kyu aa raha": {
    hinglish: "Indentation error aa raha hai. Python mein spaces matter karte hain. Dekho video ke 7:20 pe ye concept explain kiya hai.",
    timestamp: "7:20",
    codeExample: `# Wrong ❌
def hello():
print("Hi")  # No indentation!

# Correct ✅
def hello():
    print("Hi")  # 4 spaces`
  },
  "async def kya hai": {
    hinglish: "Async function ek aisa function hai jo background mein chalta hai. Jab koi slow operation ho (jaise API call), tab use karte hain taaki baaki code wait na kare.",
    timestamp: "12:15",
    codeExample: `import asyncio

async def fetch_data():
    await asyncio.sleep(2)
    return "Data received"

result = asyncio.run(fetch_data())`
  },
  "class kya hota hai": {
    hinglish: "Class ek blueprint hai objects banane ke liye. Jaise ek 'Car' class se multiple cars bana sakte ho.",
    timestamp: "15:30",
    codeExample: `class Car:
    def __init__(self, brand, model):
        self.brand = brand
        self.model = model
    
    def display(self):
        print(f"{self.brand} {self.model}")

my_car = Car("Toyota", "Camry")
my_car.display()`
  },
  "variable kya hai": {
    hinglish: "Variable ek container hai jisme data store karte hain. Jaise ek dabba jisme cheezein rakhte ho.",
    timestamp: "3:10",
    codeExample: `# Variable banao
name = "Rahul"
age = 19
city = "Jaipur"

print(f"Mera naam {name} hai")`
  },
  "list kaise use kare": {
    hinglish: "List ek collection hai multiple items ka. Square brackets [] use karte hain.",
    timestamp: "8:45",
    codeExample: `# List banao
fruits = ["apple", "banana", "mango"]

# Access karo
print(fruits[0])  # apple

# Add karo
fruits.append("orange")`
  }
};

export const mockCodeExecutionResults = {
  python: {
    success: `Hello World
Output generated successfully!
Execution time: 0.23s`,
    error: `Traceback (most recent call last):
  File "main.py", line 5
    print("Hello")
    ^
IndentationError: expected an indented block`
  },
  javascript: {
    success: `Hello World
undefined
Execution time: 0.15s`,
    error: `ReferenceError: x is not defined
    at <anonymous>:1:1`
  },
  java: {
    success: `Hello World
Execution time: 0.45s`,
    error: `Main.java:5: error: ';' expected
    System.out.println("Hello")
                                ^
1 error`
  },
  cpp: {
    success: `Hello World
Execution time: 0.18s`,
    error: `error: expected ';' before '}' token
   5 |     cout << "Hello"
     |                    ^
     |                    ;`
  }
};

export const dailyQuotes = [
  "Code karo, seekho, aage badho! 🚀",
  "Har error ek naya lesson hai! 💡",
  "Aaj ka code kal ka success hai! ⭐",
  "Practice se hi perfection aata hai! 🎯",
  "Coding sikhna marathon hai, sprint nahi! 🏃",
  "Galtiyan karo, lekin usi galti se seekho! 📚",
  "Patience rakho, code sahi hoga! ⏰",
  "Tumhara dedication hi tumhari success hai! 💪"
];

export const languageTemplates = {
  python: {
    starter: `# Start coding here
print("Hello DevSarthi!")

`,
    comment: '#',
    extension: '.py'
  },
  javascript: {
    starter: `// Start coding here
console.log("Hello DevSarthi!");

`,
    comment: '//',
    extension: '.js'
  },
  java: {
    starter: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello DevSarthi!");
    }
}
`,
    comment: '//',
    extension: '.java'
  },
  cpp: {
    starter: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello DevSarthi!" << endl;
    return 0;
}
`,
    comment: '//',
    extension: '.cpp'
  },
  c: {
    starter: `#include <stdio.h>

int main() {
    printf("Hello DevSarthi!\\n");
    return 0;
}
`,
    comment: '//',
    extension: '.c'
  }
};

export const quickQuestions = [
  "Loop kya hota hai?",
  "Function kaise banate hain?",
  "Error kyu aa raha hai?",
  "Variable kaise declare kare?",
  "List/Array kaise use kare?",
  "Class kya hai?",
  "Async/await samjhao"
];