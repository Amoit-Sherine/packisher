"use client";

import { motion } from "framer-motion";
import Button from "@/components/Button";
import { fadeUp, staggerContainer } from "@/lib/animations";

export default function CareersPage() {
  return (
    <div style={{ paddingTop: "96px", minHeight: "60vh" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "0 24px 80px" }}>
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <motion.p variants={fadeUp} style={{
            fontFamily: "var(--font-inter), sans-serif",
            color: "var(--text-muted)", fontSize: "11px",
            letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "16px"
          }}>
            Packisher · Careers
          </motion.p>
          <motion.h1 variants={fadeUp} style={{
            fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800,
            fontSize: "clamp(36px, 6vw, 60px)", color: "var(--text-primary)",
            marginBottom: "24px", lineHeight: 1.1
          }}>
            No open roles right now.
          </motion.h1>
          <motion.p variants={fadeUp} style={{
            color: "var(--text-secondary)", fontFamily: "var(--font-inter), sans-serif",
            fontSize: "17px", lineHeight: 1.75, marginBottom: "32px"
          }}>
            We work with a small team. When we are looking for someone we will post it here.
            If you want to introduce yourself in the meantime, send a short note to support@packisher.com.
          </motion.p>
          <motion.div variants={fadeUp}>
            <Button href="/contact" variant="primary" size="md">Get in Touch</Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
