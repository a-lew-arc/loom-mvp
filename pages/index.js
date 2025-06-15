import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function LoomMVP() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    client: '',
    industry: '',
    description: '',
    ask: '',
    selectedSubServices: []
  });
  const [complete, setComplete] = useState(false);
  const [thoughtStarters, setThoughtStarters] = useState([]);
  const [wantsIdeas, setWantsIdeas] = useState(null);
  const [cases, setCases] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetch('/api/cases')
      .then(res => res.json())
      .then(setCases);
    fetch('/api/teams')
      .then(res => res.json())
      .then(setTeams);
  }, []);

  const subServices = {
    'Strategic Comms': [
      'Analyst Relations', 'Award Programs', 'Campaign Development', 'Corporate Communications',
      'Crisis Communications', 'Executive Thought Leadership', 'Internal Communications'
    ],
    'Content and Creative': [
      'Animation and Motion Graphics', 'Content Strategy', 'Content Development',
      'Graphic Design', 'Interaction Design', 'UX & UI Design', 'Video Production',
      'Media and Presentation Training', 'Media Relations',
      'Messaging, Positioning, and Narrative Development', 'Personal Brand Development'
    ],
    'Digital Marketing': [
      'Creator and Influencer Relations', 'SEO & SEM', 'Social Media Strategy',
      'Organic Social for Brands and Executives', 'Paid Social'
    ],
    'Insights and Analytics': [
      'Influencer Maps', 'Landscape and Trend Analysis', 'Brand and Competitor Audits',
      'Measurement & Reporting', 'Research'
    ],
    'Brand Strategy': [
      'Brand Creation', 'Brand Experiences', 'Brand Identity'
    ],
    'DEI Comms': [
      'DEI Communications (internal and external)', 'Diverse Communities Engagement', 'Strategic Communications'
    ]
  };

  const next = () => setStep(s => s + 1);
  const prev = () => setStep(s => s - 1);
  const update = (field, val) => setForm({ ...form, [field]: val });
  const toggleSubService = (s) => {
    const has = form.selectedSubServices.includes(s);
    update('selectedSubServices', has ? form.selectedSubServices.filter(x => x !== s) : [...form.selectedSubServices, s]);
  };

  const generate = () => {
    setWantsIdeas(null);
    setStep(2);
  };

  const confirmGenerate = async () => {
    if (wantsIdeas === false) {
      setThoughtStarters([]);
      setComplete(true);
      return;
    }
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ask: form.ask,
        industry: form.industry,
        services: form.selectedSubServices
      })
    });
    const { ideas } = await res.json();
    setThoughtStarters(ideas);
    setComplete(true);
  };

  const handleLoveIt = () => alert("Great! We will save this blueprint and follow up shortly.");
  const handleIntrigued = () => {
    alert("No problem! You can adjust your inputs or refine your blueprint.");
    setStep(1);
    setComplete(false);
  };
  const handleReset = () => {
    if (window.confirm("Are you sure you want to start over?")) {
      setForm({ client: '', industry: '', description: '', ask: '', selectedSubServices: [] });
      setThoughtStarters([]);
      setComplete(false);
      setStep(0);
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto text-gray-900">
      <h1 className="text-3xl font-bold mb-4">Archetype LOOM</h1>
      {!complete ? (
        <div>
          {step === 0 && (
            <div>
              <p className="mb-2">You are looking at a blueprint, not a brief.</p>
              <input placeholder="Client" value={form.client} onChange={e => update('client', e.target.value)} className="border p-2 mb-2 w-full" />
              <input placeholder="Industry" value={form.industry} onChange={e => update('industry', e.target.value)} className="border p-2 mb-2 w-full" />
              <textarea placeholder="Description" value={form.description} onChange={e => update('description', e.target.value)} className="border p-2 mb-2 w-full h-24" />
              <textarea placeholder="What is the challenge or ask?" value={form.ask} onChange={e => update('ask', e.target.value)} className="border p-2 mb-2 w-full h-24" />
              <button onClick={next} className="bg-black text-white px-4 py-2">Next</button>
            </div>
          )}
          {step === 1 && (
            <div>
              <p className="mb-4">Select your service considerations:</p>
              {Object.entries(subServices).map(([cat, subs]) => (
                <div key={cat} className="mb-4">
                  <h4 className="font-semibold text-lg mb-2">{cat}</h4>
                  <div className="flex flex-wrap">
                    {subs.map(s => (
                      <button
                        key={s}
                        onClick={() => toggleSubService(s)}
                        className={`border px-3 py-1 m-1 rounded-full hover:bg-gray-100 ${form.selectedSubServices.includes(s) ? 'bg-black text-white' : ''}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div className="mt-4">
                <button onClick={prev} className="mr-2 border px-4 py-2">Back</button>
                <button onClick={generate} className="bg-green-600 text-white px-4 py-2">Generate Blueprint</button>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="my-6">
              <h3 className="text-lg font-semibold mb-2">Would you like to view AI-generated thought starters as part of your blueprint?</h3>
              <p className="mb-4 text-sm text-gray-600">These can help spark creative directions and add perspective to your planning.</p>
              <div className="flex space-x-4">
                <button onClick={() => { setWantsIdeas(true); confirmGenerate(); }} className="bg-black text-white px-4 py-2">Yes</button>
                <button onClick={() => { setWantsIdeas(false); confirmGenerate(); }} className="bg-gray-200 px-4 py-2">No</button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-2xl font-semibold mb-2">LOOM Blueprint for {form.client}</h2>
          <p className="mb-1 text-sm italic">You are looking at a blueprint, not a brief.</p>
          <p className="mb-2"><strong>Industry:</strong> {form.industry}</p>
          <p className="mb-2"><strong>Ask:</strong> {form.ask}</p>
          <div className="mb-4">
            <strong>Selected Services:</strong>
            {Object.entries(subServices).map(([cat, subs]) => {
              const filtered = subs.filter(s => form.selectedSubServices.includes(s));
              return filtered.length > 0 ? (
                <div key={cat} className="ml-4">
                  <p className="font-semibold mt-2">{cat}</p>
                  <ul className="list-disc list-inside">
                    {filtered.map(service => <li key={service}>{service}</li>)}
                  </ul>
                </div>
              ) : null;
            })}
          </div>

          <h3 className="text-xl font-semibold mb-2">Core Case Studies</h3>
          <p className="mb-2">Explore our success stories that showcase our expertise in action, giving you a glimpse of what is possible for your project.</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {cases
              .filter(c => c.tags.some(tag => form.selectedSubServices.includes(tag)))
              .map((c, i) => (
                <div key={i} className="border p-3">
                  <p className="text-sm font-bold">{c.client}</p>
                  <p className="text-xs">{c.type}</p>
                  <p className="text-xs text-green-600">{c.result}</p>
                  <p className="text-xs text-gray-500">Tags: {c.tags.join(', ')}</p>
                </div>
            ))}
          </div>

          <h3 className="text-xl font-semibold mb-2">The Right Team Makes a Difference</h3>
          <p className="mb-2">Meet the exceptional individuals who will drive your project forward, carefully selected to match your unique needs and goals.</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {teams
              .filter(member => member.tags.some(tag => form.selectedSubServices.includes(tag)))
              .map((member, i) => (
                <div key={i} className="border p-3">
                  <h4 className="font-bold">{member.name}</h4>
                  <p>{member.title}</p>
                  <p className="text-sm text-gray-600">{member.tags.join(', ')}</p>
                  <p className="text-xs">Capacity: {member.capacity}</p>
                  <p className="text-xs text-gray-500">Location: {member.location}</p>
                </div>
            ))}
          </div>

          {thoughtStarters.length > 0 && (
            <>
              <h3 className="text-xl font-semibold mb-2">Ideas We Might Explore</h3>
              <ul className="list-disc list-inside mb-4">
                {thoughtStarters.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </>
          )}

          <h3 className="text-xl font-semibold mb-2">Next Steps</h3>
          <p className="mb-2">You are one step ahead. Here is what to do next:</p>
          <div className="flex space-x-2">
            <button onClick={handleLoveIt} className="bg-black text-white px-3 py-2">I love this!</button>
            <button onClick={handleIntrigued} className="bg-gray-200 px-3 py-2">Not sure, but I’m intrigued</button>
            <button onClick={handleReset} className="bg-red-100 px-3 py-2">I think I need a soft reset</button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
