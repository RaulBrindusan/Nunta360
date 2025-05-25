
import React from 'react';

const testimonials = [
  {
    name: 'Maria & Alexandru',
    location: 'București',
    quote: 'Nunta360 made our wedding planning so much easier! We could track everything in one place.',
    rating: 5
  },
  {
    name: 'Elena & Cristian',
    location: 'Cluj-Napoca',
    quote: 'The vendor discovery feature helped us find amazing local professionals. Highly recommended!',
    rating: 5
  },
  {
    name: 'Andreea & Mihai',
    location: 'Timișoara',
    quote: 'Budget planning was a breeze with this app. We stayed within our budget and had our dream wedding.',
    rating: 5
  }
];

const ShowcaseSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-sage-50 to-blush-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-charcoal mb-4">
            Trusted by Hundreds of
            <span className="text-dustyRose-400"> Romanian Couples</span>
          </h2>
          <p className="text-lg text-charcoal/70">
            Join thousands of couples who planned their perfect wedding with Nunta360
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-blush-100"
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-blush-400 text-xl">★</span>
                ))}
              </div>
              <p className="text-charcoal/80 mb-4 italic leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div className="border-t border-blush-100 pt-4">
                <p className="font-semibold text-charcoal">{testimonial.name}</p>
                <p className="text-charcoal/60 text-sm">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl lg:text-4xl font-bold text-blush-400 mb-2">500+</div>
            <div className="text-charcoal/70">Happy Couples</div>
          </div>
          <div>
            <div className="text-3xl lg:text-4xl font-bold text-dustyRose-400 mb-2">1,200+</div>
            <div className="text-charcoal/70">Vendors</div>
          </div>
          <div>
            <div className="text-3xl lg:text-4xl font-bold text-sage-500 mb-2">50+</div>
            <div className="text-charcoal/70">Cities</div>
          </div>
          <div>
            <div className="text-3xl lg:text-4xl font-bold text-blush-400 mb-2">98%</div>
            <div className="text-charcoal/70">Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;
