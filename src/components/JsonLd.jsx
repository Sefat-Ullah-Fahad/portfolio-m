import { SITE } from '@/lib/site';

export default function JsonLd() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE.name,
    url: SITE.url,
    image: SITE.image,
    jobTitle: 'Full Stack Developer',
    email: SITE.email,
    telephone: SITE.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Rajshahi',
      addressCountry: 'BD',
    },
    sameAs: Object.values(SITE.social),
    knowsAbout: [
      'React',
      'Next.js',
      'Node.js',
      'MongoDB',
      'TypeScript',
      'WordPress',
      'SEO',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.shortTitle,
    url: SITE.url,
    description: SITE.description,
    author: { '@type': 'Person', name: SITE.name },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
