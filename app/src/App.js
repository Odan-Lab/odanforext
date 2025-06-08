import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <section className="container mx-auto px-4 py-16 text-center">
        <motion.h1
          className="text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Welcome to ODAN
        </motion.h1>
        <p className="text-xl mb-8 text-gray-300">
          A New Frontier in Decentralized Innovation
        </p>
        <motion.div
          className="max-w-lg mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gray-800/70 border-none">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-semibold">Join the Waitlist</h2>
              <Input placeholder="Enter your email" className="bg-gray-900 border-gray-700" />
              <Button className="w-full bg-purple-600 hover:bg-purple-700 transition-all">
                Join Now
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-6 text-center">Whitepaper</h2>
        <div className="text-gray-300 max-w-3xl mx-auto text-lg space-y-4">
          <p>
            ODAN is a cutting-edge blockchain network designed for performance,
            scalability, and security. It introduces innovative consensus mechanisms,
            robust smart contract capabilities, and a decentralized governance model.
          </p>
          <p>
            With ODAN, developers and users alike benefit from fast transaction speeds,
            low fees, and a vibrant ecosystem ready for the next generation of dApps.
          </p>
          <Button className="mt-4 bg-purple-600 hover:bg-purple-700 transition-all">
            Download Full Whitepaper
          </Button>
        </div>
      </section>

      <footer className="text-center text-gray-500 py-8 border-t border-gray-800">
        &copy; {new Date().getFullYear()} ODAN Network. All rights reserved.
      </footer>
    </main>
  );
}
