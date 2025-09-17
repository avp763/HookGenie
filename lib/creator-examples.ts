export type CreatorType = "None (Default)" | "MrBeast" | "Alex Hormozi" | "GaryVee" | "Ali Abdaal"

export interface CreatorExample {
  hook: string
  body: string
}

export const CREATOR_EXAMPLES: Record<CreatorType, CreatorExample[]> = {
  "None (Default)": [],
  
  "MrBeast": [
    {
      hook: "Don't turn around.",
      body: "Don't turn around. Win $10,000 to win the money. You cannot turn around. I'm not turning around, Jimmy. There's nowhere. There is literally nothing you could tell me to make me turn. I'm not turning around. You've got 10 seconds. Sabrina Carpenter. You literally could have just said hi to Sabrina Carpenter, but I don't know if it's safe here. 5 4 You can turn around. No, I can't. Jimmy, this is your 10 grand. Turn around. You would have actually won 100 grand. I tried to tell"
    },
    {
      hook: "Hit subscribe—give clean water with one click.",
      body: "Every single time one of you subscribes, I will donate a penny to team water. Oh gosh. This is what one subscriber equals in clean water. And this is how much water they get if 50 of you subscribe. Hit subscribe right now to help people in need. to strike right"
    }
  ],
  
  "Alex Hormozi": [
    {
      hook: "Want 10 million? Most people stack cash like wobbly boxes—one shake and it topples. I'll show you how to lay the first brick so the tower can't fall.",
      body: "if I told you to build the tallest tower you possibly could in 10 seconds here's how you might [Music] do Time Imagine I told you to build the tallest building you possibly could in 10 days you would probably say you know what I can probably get some more boxes and I probably wouldn't build it cuz how flimsy is this so I might build it piece by piece from the ground up with more stable bricks from day one and I keep adding and keep adding and keep adding and then when 10 days came I might be five stories high the fastest way to get to this tall is to build it the exact way I did earlier but if I then said I need you to build something that's 10 stories tall you would never get there and what happens is people get stuck and they can't add another one on top and it's because you built it wrong to begin with sometimes the fastest way to get to 10 million is to start back at zero and build it right to begin with because this thing is never going to last"
    },
    {
      hook: "What's the one ingredient in business that works like the perfect sandwich bite—so good that everything else fades into irrelevance?",
      body: "if I open a sandwich shop how can I make the sandwiches too good like if someone takes a bite they're like this is the best sandwich I've ever had if you just get that then the rest of it doesn't matter it's like what is the one thing that if I just get this one thing right everything else shrinks into irrelevance"
    }
  ],
  
  "GaryVee": [
    {
      hook: "Imagine getting paid just to walk and talk. That's the future.",
      body: "Every human that makes under $20 an hour that's watching right now needs to hear me. I see a business in the future where people get paid to walk with other people. Create a Facebook account and then run $10 of ads. $10 on a video saying, \"Yo, I live in Topeka, Kansas, and I live on this area and I'll walk with anybody. I'll walk with you and talk and communicate and chop it up with anybody in this 10 mile radius and run ads. $10 in Facebook ads on that 10 milei radius."
    }
  ],
  
  "Ali Abdaal": [
    {
      hook: "so if you're struggling to stay focused while studying then you might want to try a technique called Adventure studying",
      body: "so if you're struggling to stay focused while studying then you might want to try a technique called Adventure studying this is a concept from computer science Professor Cal Newport and it's based on the idea that our brain craves novelty normally studying in your room or in your library is pretty boring but if you can find a way to incorporate a sense of adventure into your work you'll automatically become more productive and you'll even enjoy the process a little bit more for example you might try taking a walk to the local coffee shop and working from there or maybe even heading outdoors and studying under a tree or something if you've got a free weekend coming up take a road trip with friends to a cottage and study together from there it's really all about finding ways to enjoy the journey because when we're having fun productivity takes care of itself"
    },
    {
      hook: "this is the halo effect and it's subtly influencing your thoughts Without You realizing it's a phenomenon where if a person has one positive trait like being conventionally good looking then we assume they must have other positive traits like being intelligent or kind or successful even if we've just met them",
      body: "this is the halo effect and it's subtly influencing your thoughts Without You realizing it's a phenomenon where if a person has one positive trait like being conventionally good looking then we assume they must have other positive traits like being intelligent or kind or successful even if we've just met them and if we have no evidence to support that and this happens in almost every area of Life teachers might assume that a student who excels at one subject like maths is a strong student overall even if they actually struggle in other areas and this is particularly significant in politics where a leader who's charismatic and good at public speaking might be assumed to be a strong leader overall even if they've not yet proven themselves in other areas like policy and decision making but the halo effect can also work in Reverse where if someone has one negative trait like having dirty clothes it leads us to believe that they have other negative traits as well like being disorganized and lazy and unproductive so how can we use this to our advantage well for ourselves we can try and be more aware that the halo effect exists and try to do things to make a good first impression and with others we can try not to let one positive or one negative trait Define our entire perception of them"
    }
  ]
}

export function getCreatorExamplesPrompt(creator: CreatorType): string {
  if (creator === "None (Default)") {
    return ""
  }
  
  const examples = CREATOR_EXAMPLES[creator]
  if (!examples || examples.length === 0) {
    return ""
  }
  
  const exampleTexts = examples.map((example, index) => 
    `Example ${index + 1}:\nHook: ${example.hook}\nBody: ${example.body}`
  ).join('\n\n')
  
  return `You are HookGenie. Clone the exact script style — pacing, rhythm, transitions, tone, and structure — of ${creator}, based on these full script examples:

${exampleTexts}

Match sentence length, emotional pacing, delivery rhythm, and structural patterns from examples.`
}