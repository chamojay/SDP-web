import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Wifi, Coffee, Car, Phone, MapPin, Mail } from "lucide-react";
import Link from "next/link";
import NewsletterForm from "@/components/NewsletterForm";
import DynamicContent from "./components/DynamicContent";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center" id="home">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 text-center px-4 fade-in">
          <Leaf className="h-16 w-16 mx-auto mb-6 text-primary" />
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Welcome to Algama Ella
            <span className="block text-2xl md:text-3xl mt-2">Eco Lodge</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Experience luxury in harmony with nature. Discover our eco-friendly lodge
            nestled in the heart of pristine wilderness.
          </p>
          <Button size="lg" asChild>
            <Link href="#rooms">
              Explore Our Rooms
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Quick Info Section */}
      <section className="py-12 bg-card">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center space-x-4 p-6 rounded-lg bg-background/50 backdrop-blur-sm">
            <Phone className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold">Contact Us</h3>
              <p className="text-muted-foreground"> 
                 <a href="tel:+94755202302"
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors">+94 755202302</a></p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-6 rounded-lg bg-background/50 backdrop-blur-sm">
            <MapPin className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold">Location</h3>
              <p className="text-muted-foreground">
              <a 
                href="https://maps.app.goo.gl/maPKovUBePiq6uaa9"
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                Algama Medagama, Sri Lanka
              </a>
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-6 rounded-lg bg-background/50 backdrop-blur-sm">
            <Mail className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold">Email</h3>
              <p className="text-muted-foreground">info@algamaella.com</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Content (Rooms and Activities) */}
      <DynamicContent />

      {/* Packages Section */}
      <section className="py-20 px-4 bg-muted" id="packages">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Stay Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Room Only",
                price: "From $150",
                features: [
                  "Accommodation only",
                  "Access to all facilities",
                  "Free Wi-Fi",
                  "Welcome drink",
                ],
              },
              {
                name: "Half Board",
                price: "From $200",
                features: [
                  "Accommodation",
                  "Breakfast and Dinner",
                  "Access to all facilities",
                  "Free Wi-Fi",
                  "Welcome drink",
                  "Evening tea/coffee service",
                ],
                highlighted: true,
              },
              {
                name: "Full Board",
                price: "From $250",
                features: [
                  "Accommodation",
                  "All meals included",
                  "Access to all facilities",
                  "Free Wi-Fi",
                  "Welcome drink",
                  "Daily tea/coffee service",
                  "Complimentary mini bar",
                ],
              },
            ].map((pkg) => (
              <div
                key={pkg.name}
                className={`bg-card rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 ${
                  pkg.highlighted ? 'ring-2 ring-primary' : ''
                }`}
              >
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-4">{pkg.name}</h3>
                  <p className="text-xl font-bold text-primary mb-6">{pkg.price}</p>
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-center text-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={pkg.highlighted ? "default" : "outline"}>
                    Select Package
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-20 px-4 bg-background" id="amenities">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Hotel Amenities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Wifi, name: "Free Wi-Fi" },
              { icon: Coffee, name: "Restaurant" },
             
              { icon: Car, name: "Parking" },
              { icon: Leaf, name: "Garden" },
            ].map((amenity) => (
              <div
                key={amenity.name}
                className="flex flex-col items-center p-6 bg-card rounded-lg text-center"
              >
                <amenity.icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-medium">{amenity.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Footer */}
      <footer className="bg-muted pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
              <address className="not-italic space-y-3">
                <p>Algama,Medagama  Sri lanka</p>
                <p className="hover:text-primary transition-colors">
                  <a href="tel:+94755202302">+94 755202302</a>
                </p>
                <p className="hover:text-primary transition-colors">
                  <a href="mailto:info@algamaella.com">info@algamaella.com</a>
                </p>
              </address>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {['About Us', 'Rooms', 'Packages', 'Activities'].map((link) => (
                  <li key={link}>
                    <Link href={`#${link.toLowerCase().replace(' ', '-')}`} 
                          className="hover:text-primary transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Policies */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Policies</h3>
              <ul className="space-y-3">
                {['Privacy Policy', 'Terms of Service', 'Cancellation Policy'].map((policy) => (
                  <li key={policy}>
                    <Link href={`/policies/${policy.toLowerCase().replace(' ', '-')}`}
                          className="hover:text-primary transition-colors">
                      {policy}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Newsletter</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Subscribe to our newsletter for updates and special offers.
              </p>
              <NewsletterForm />
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© 2025 Algama Ella Eco Lodge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}