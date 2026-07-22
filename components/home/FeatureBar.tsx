"use client";

import { features } from "@/lib/data";

export function FeatureBar() {
  return (
    <section className="bg-[#0D0820] border-y border-purple-900/20 py-6">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <div key={i} className="flex items-start gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-purple-900/30 border border-purple-800/30 flex items-center justify-center text-xl flex-shrink-0 group-hover:border-purple-600/50 transition-all">
                {f.icon}
              </div>
              <div>
                <div className="text-white text-sm font-semibold">{f.title}</div>
                <div className="text-gray-400 text-xs leading-relaxed">{f.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
