import { motion } from 'framer-motion';

const Backdrop = ({ onClick }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 w-full h-full bg-black z-50"
            onClick={onClick}
        />
    );
};

export default Backdrop;