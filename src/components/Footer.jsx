import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-gray-200 py-16 border-t border-neutral-800 relative overflow-hidden">
      {/* Subtle Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-neutral-900 opacity-70"></div>

      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Inception Quote */}
        <motion.blockquote
          className="text-xl md:text-2xl italic text-neutral-300 mb-8 max-w-2xl mx-auto relative px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          "Downward Is The Only Way Forward."
          <div className="text-sm text-neutral-500 mt-2">
            ~ Inception (2010)
          </div>
        </motion.blockquote>

        {/* Social Links with Subtle Pop Hover */}
        <div className="flex justify-center gap-10 text-3xl mb-8">
          {[
            { Icon: FaGithub, href: "https://github.com/GeekNoob04" },
            {
              Icon: FaLinkedin,
              href: "https://www.linkedin.com/in/harshit-budhraja-621a70251/",
            },
            { Icon: FaTwitter, href: "https://x.com/BudhrajaHarshit" },
            {
              Icon: FaInstagram,
              href: "https://www.instagram.com/harshitisdelusional/",
            },
          ].map(({ Icon, href }) => (
            <motion.a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-white"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Icon />
            </motion.a>
          ))}
        </div>

        <motion.div
          className="text-neutral-600 text-xs tracking-wider uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          © {new Date().getFullYear()} Harshit Budhraja
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
