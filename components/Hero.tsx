'use client';

import { ArrowRight, Github, Twitter } from 'lucide-react';
import { useEffect, useState } from 'react';

const paragraphs = [
  "Hisse senedi, kripto para ve emtia piyasalarıyla uzun yıllardır ilgileniyorum.",
  "Bu platformda; kendi yatırım felsefemi, piyasalarla ilgili düşüncelerimi ve yaptığım işlemlerden edindiğim deneyimleri paylaşıyorum.",
  "Blog yazılarım ve sosyal medya paylaşımlarım bilgilendirme amaçlıdır."
];

export default function Hero() {
  const [displayedText, setDisplayedText] = useState<string[]>(['', '', '']);
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (currentParagraph < paragraphs.length) {
      if (currentChar < paragraphs[currentParagraph].length) {
        const typingSpeed = 30;
        const timer = setTimeout(() => {
          const newTexts = [...displayedText];
          newTexts[currentParagraph] = paragraphs[currentParagraph].substring(0, currentChar + 1);
          setDisplayedText(newTexts);
          setCurrentChar(currentChar + 1);
        }, typingSpeed);

        return () => clearTimeout(timer);
      } else {
        const delayTimer = setTimeout(() => {
          setCurrentParagraph(currentParagraph + 1);
          setCurrentChar(0);
        }, 800);

        return () => clearTimeout(delayTimer);
      }
    } else {
      setIsTyping(false);
    }
  }, [currentParagraph, currentChar, displayedText]);

  return (
    <section className="min-h-screen flex items-center justify-center pt-20 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          Merhaba, Ben <span className="text-blue-500">Soner Yılmaz</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Bireysel Yatırımcı & Piyasa Gözlemcisi
        </p>
        {paragraphs.map((_, index) => (
          <p 
            key={index} 
            className={`text-lg text-gray-500 mb-4 max-w-3xl mx-auto min-h-[4.5rem] ${
              index <= currentParagraph ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {displayedText[index]}
            {index === currentParagraph && isTyping && (
              <span className="animate-pulse">|</span>
            )}
          </p>
        ))}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/blog"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
          >
            Blog Yazılarım <ArrowRight className="w-5 h-5" />
          </a>
          <a
            href="#iletisim"
            className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-lg font-semibold transition-all"
          >
            İletişim
          </a>
        </div>

        <div className="flex justify-center gap-6 mt-12">
          <a
            href="https://twitter.com/soner_yilmz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-500 transition-colors"
          >
            <Twitter className="w-6 h-6" />
          </a>
          <a
            href="https://github.com/akrep0121"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-500 transition-colors"
          >
            <Github className="w-6 h-6" />
          </a>
        </div>
      </div>
    </section>
  );
}
