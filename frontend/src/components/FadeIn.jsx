import { motion } from 'framer-motion';

function FadeIn({ children, delay = 0, style }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: 'easeOut' }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export default FadeIn;