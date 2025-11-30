import React from "react";

export default function Features() {
  const items = [
    { emoji: "🔒", title: "Privacy First", desc: "Mathematically guaranteed anonymity." },
    { emoji: "💰", title: "Earn Money", desc: "Set your price per query." },
    { emoji: "🧪", title: "Help Research", desc: "Contribute to science safely." }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6 mt-6">
      {items.map((it) => (
        <div
          key={it.title}
          className="p-6 bg-white rounded-lg shadow-card border border-gray-200"
        >
          <div className="text-3xl mb-3">{it.emoji}</div>

          <h3 className="font-bold text-gray-900 mb-2">{it.title}</h3>

          <p className="text-gray-700 text-sm">{it.desc}</p>
        </div>
      ))}
    </div>
  );}