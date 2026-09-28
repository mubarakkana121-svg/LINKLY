import { motion, AnimatePresence } from 'framer-motion';

function DynamicIslandProgress({ status, progress }) {
  return (
    <div style={{ position: 'fixed', top: '18px', left: '50%', transform: 'translateX(-50%)', zIndex: 100, pointerEvents: 'none' }}>
      <AnimatePresence>
        {status && (
          <motion.div
            key="island"
            initial={{ opacity: 0, scale: 0.7, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: -10 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            style={{
              background: '#0b0b0f',
              border: '1px solid rgba(255,255,255,.14)',
              borderRadius: '999px',
              padding: status === 'success' ? '10px 18px' : '10px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 10px 30px rgba(0,0,0,.5)',
              color: '#f5f3ff',
              fontSize: '13px',
              fontWeight: 600,
              minWidth: status === 'uploading' ? '180px' : 'auto',
            }}
          >
            {status === 'uploading' && (
              <>
                <span>Uploading…</span>
                <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,.15)', borderRadius: '2px', overflow: 'hidden' }}>
                  <motion.div
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: 'easeOut', duration: 0.2 }}
                    style={{ height: '100%', background: 'linear-gradient(90deg,#9b5cff,#65c7ff)' }}
                  />
                </div>
                <span style={{ color: 'var(--muted)' }}>{progress}%</span>
              </>
            )}
            {status === 'success' && (
              <>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 12 }}
                  style={{ color: '#6ee7c5' }}
                >
                  ✓
                </motion.span>
                <span>Upload complete</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DynamicIslandProgress;