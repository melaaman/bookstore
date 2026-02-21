import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const books = [
  // Fiction
  {
    title: 'The Last Lighthouse',
    author: 'Elena Marsh',
    genre: 'Fiction',
    price: 14.99,
    description:
      'A sweeping tale of love, loss, and redemption set against the rugged coast of Maine. When lighthouse keeper Ada discovers a bundle of letters hidden in the walls, she embarks on a journey that will upend everything she thought she knew about her family.',
    stock: 12,
  },
  {
    title: 'Echoes of Tomorrow',
    author: 'James Callahan',
    genre: 'Fiction',
    price: 16.99,
    description:
      'A moving portrait of three generations of a Chicago family navigating the fault lines of race, ambition, and belonging. Callahan writes with surgical precision and genuine warmth.',
    stock: 8,
  },
  {
    title: "The Painter's Secret",
    author: 'Sofia Laurent',
    genre: 'Fiction',
    price: 13.99,
    description:
      'Set in 1920s Paris, this luminous novel follows a young art restorer who uncovers a forgery ring hidden within the works of a celebrated master—and the dangerous truth behind a century-old disappearance.',
    stock: 15,
  },
  // Mystery
  {
    title: 'Dead End Street',
    author: 'Marcus Webb',
    genre: 'Mystery',
    price: 12.99,
    description:
      'Detective Lena Voss returns to her hometown to bury her father and stumbles into the darkest case of her career. Gritty, relentless, and impossible to put down.',
    stock: 20,
  },
  {
    title: 'The Silent Witness',
    author: 'Catherine Holt',
    genre: 'Mystery',
    price: 15.99,
    description:
      'When a witness to a brutal crime goes mute, forensic linguist Dr. Nora Blaine must decode the clues hidden in silence. A razor-sharp procedural with a twist that will leave you breathless.',
    stock: 9,
  },
  {
    title: 'Midnight at the Riviera',
    author: 'Pierre Dubois',
    genre: 'Mystery',
    price: 17.99,
    description:
      'On the French Riviera, a jewel thief is found dead in a locked casino suite. Inspector Moreau has one night to solve the case before the trail goes cold. Glamorous, twisty, and utterly gripping.',
    stock: 6,
  },
  // Fantasy
  {
    title: 'The Iron Crown',
    author: 'Lyra Nightshade',
    genre: 'Fantasy',
    price: 19.99,
    description:
      'In a world where magic is outlawed and memories can be stolen, a young blacksmith discovers she can forge weapons from pure light. The first book in the epic Shattered Realm trilogy.',
    stock: 14,
  },
  {
    title: 'Ember and Ash',
    author: 'Tobias Drake',
    genre: 'Fantasy',
    price: 18.99,
    description:
      'Two rival dragon riders must forge an uneasy alliance when an ancient evil stirs beneath the mountains. Drake delivers a thrillingly original world packed with political intrigue and breathtaking action.',
    stock: 11,
  },
  {
    title: 'The Forgotten Kingdom',
    author: 'Aelindra Ross',
    genre: 'Fantasy',
    price: 21.99,
    description:
      'A cartographer mapping the edges of a dying empire discovers a city that should not exist—and its inhabitants have been waiting for her. A gorgeous, melancholy fantasy full of wonder.',
    stock: 7,
  },
  // Science Fiction
  {
    title: 'Parallel Horizons',
    author: 'Zara Quinn',
    genre: 'Science Fiction',
    price: 16.99,
    description:
      "When a physicist accidentally opens a door to a parallel Earth, she finds a version of herself who made all the right choices—and one who made all the wrong ones. A thought-provoking examination of identity and regret.",
    stock: 10,
  },
  {
    title: 'The Quantum Code',
    author: 'Nathan Frost',
    genre: 'Science Fiction',
    price: 14.99,
    description:
      'A message encoded in quantum noise leads a team of scientists to a terrifying conclusion: the universe is running on software, and someone is about to hit delete. Hard SF at its most gripping.',
    stock: 13,
  },
  {
    title: 'Stars Without End',
    author: 'Mila Vasquez',
    genre: 'Science Fiction',
    price: 22.99,
    description:
      'Humanity\'s last generation ship approaches its destination after 400 years of travel—only to find it already inhabited. An epic of first contact, cultural collision, and what it means to call a place home.',
    stock: 5,
  },
  // Biography
  {
    title: 'The Reluctant Revolutionary',
    author: 'Helen Francis',
    genre: 'Biography',
    price: 18.99,
    description:
      'A definitive biography of Marie Curie that goes beyond the Nobel prizes to reveal the full, complicated, magnificent life of a woman who rewrote the laws of physics and refused to be diminished.',
    stock: 8,
  },
  {
    title: 'A Voice in the Storm',
    author: 'David Lin',
    genre: 'Biography',
    price: 15.99,
    description:
      'The extraordinary true story of three ordinary people caught at history\'s hinge points—and how courage, luck, and stubbornness changed the world. Gripping narrative nonfiction at its finest.',
    stock: 16,
  },
  {
    title: "The Inventor's Mind",
    author: 'Patricia Wells',
    genre: 'Biography',
    price: 24.99,
    description:
      'A meticulous and deeply human portrait of Nikola Tesla—his brilliance, his obsessions, his tragic feud with Edison, and the inventions he took to his grave. Thoroughly researched and beautifully written.',
    stock: 9,
  },
  // Romance
  {
    title: 'Summer in Tuscany',
    author: 'Isabella Reyes',
    genre: 'Romance',
    price: 13.99,
    description:
      'A burned-out chef inherits a crumbling farmhouse in the Tuscan hills and finds far more than she bargained for—including a taciturn neighbor with a past of his own. Warm, sensuous, and deeply satisfying.',
    stock: 18,
  },
  {
    title: 'The Last Train to Paris',
    author: 'Chloe Martin',
    genre: 'Romance',
    price: 12.99,
    description:
      'Two strangers share a compartment on a overnight train from London to Paris. By morning, everything has changed. A compact, achingly romantic novel with one of the most memorable love scenes in recent fiction.',
    stock: 22,
  },
  {
    title: 'Heart of the City',
    author: 'Ryan Cole',
    genre: 'Romance',
    price: 14.99,
    description:
      'A firefighter and an urban planner find themselves on opposite sides of a development battle—and increasingly unable to deny their chemistry. Cole writes contemporary romance with real wit and emotional intelligence.',
    stock: 11,
  },
  // History
  {
    title: 'The Fall of Empires',
    author: 'Robert Hawkins',
    genre: 'History',
    price: 27.99,
    description:
      'A sweeping comparative history of imperial collapse from Rome to the British Empire. Hawkins finds startling patterns across millennia and asks what they tell us about the world\'s current superpowers.',
    stock: 7,
  },
  {
    title: 'Ancient Voices',
    author: 'Hannah Greer',
    genre: 'History',
    price: 23.99,
    description:
      'Using recently translated tablets, Greer reconstructs the daily lives of ordinary people in the ancient world—their jokes, their worries, their loves. History has rarely felt this alive.',
    stock: 6,
  },
  {
    title: 'The Century That Changed Everything',
    author: 'Thomas Wren',
    genre: 'History',
    price: 29.99,
    description:
      'An authoritative and electrifying account of the twentieth century, structured around forty-eight pivotal days when history turned on a knife\'s edge. A modern classic of popular history.',
    stock: 10,
  },
  // Self-Help
  {
    title: 'The Clarity Method',
    author: 'Sandra Hayes',
    genre: 'Self-Help',
    price: 17.99,
    description:
      'A practical, evidence-based framework for cutting through mental noise and making better decisions. Hayes draws on cognitive science, behavioral economics, and ancient philosophy without ever getting preachy.',
    stock: 25,
  },
  {
    title: 'Unbreakable',
    author: 'Leo Park',
    genre: 'Self-Help',
    price: 15.99,
    description:
      'Building mental resilience isn\'t about becoming harder—it\'s about becoming more flexible. Park\'s seven-week program has helped thousands of people navigate adversity, uncertainty, and change.',
    stock: 19,
  },
  {
    title: 'The Art of Deliberate Living',
    author: 'Emma Stone',
    genre: 'Self-Help',
    price: 16.99,
    description:
      'A thoughtful and gently subversive guide to designing a life around what actually matters to you—not what productivity culture, social media, or well-meaning relatives tell you should matter.',
    stock: 14,
  },
]

async function main() {
  console.log('Seeding database...')

  // Create a demo user
  const hashed = await bcrypt.hash('password123', 10)
  await prisma.user.upsert({
    where: { email: 'demo@bookstore.dev' },
    update: {},
    create: {
      email: 'demo@bookstore.dev',
      password: hashed,
      name: 'Demo User',
    },
  })

  // Create books
  for (const book of books) {
    await prisma.book.create({ data: book })
  }

  console.log(`Seeded ${books.length} books and 1 demo user.`)
  console.log('Demo login: demo@bookstore.dev / password123')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
