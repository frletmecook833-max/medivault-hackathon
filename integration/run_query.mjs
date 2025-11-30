import fetch from "node-fetch";

async function run() {
  const res = await fetch("http://localhost:3000/query", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ageMin: 30,
      ageMax: 40,
      condition: "diabetes",
      epsilon: 1.0
    })
  });

  const data = await res.json();
  console.log("API response:", data);
}

run();
