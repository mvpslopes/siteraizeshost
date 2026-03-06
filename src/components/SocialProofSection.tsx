import { Star, Users } from 'lucide-react';

export default function SocialProofSection() {
  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4">
        {/* Social Proof Card */}
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary-50 to-white p-8 rounded-3xl shadow-lg border border-primary-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i} 
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 border-2 border-white shadow-lg"
                  ></div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-5 h-5 fill-primary-500 text-primary-500" />
                    ))}
                  </div>
                  <span className="text-2xl font-bold text-gray-800">4.9</span>
                </div>
                <p className="text-sm text-gray-600 font-medium">Clientes Satisfeitos</p>
              </div>
            </div>
            <div className="h-16 w-px bg-gray-200 hidden md:block"></div>
            <div className="text-center md:text-left">
              <p className="text-4xl font-bold text-primary-600 mb-1">50k+</p>
              <p className="text-sm text-gray-600 font-medium">Participantes em Eventos</p>
            </div>
            <div className="h-16 w-px bg-gray-200 hidden md:block"></div>
            <div className="text-center md:text-left">
              <p className="text-4xl font-bold text-primary-600 mb-1">500+</p>
              <p className="text-sm text-gray-600 font-medium">Eventos Realizados</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

