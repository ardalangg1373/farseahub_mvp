import { Toaster } from '@/components/ui/sonner';

import "./App.css";

import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

import Home from '@/pages/Home';
import Marketplace from '@/pages/Marketplace';
import Tourism from '@/pages/Tourism';
import Dating from '@/pages/Dating';
import Metaverse from '@/pages/Metaverse';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Profile from '@/pages/Profile';
import NotFound from '@/pages/NotFound';

// صفحات جدید
import Whitepaper from '@/pages/Whitepaper';
import FarsiCoin from '@/pages/FarsiCoin';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="farseahub-theme">
      <TooltipProvider>
        <Toaster theme="dark" />

        <BrowserRouter>
          {/* پس‌زمینه‌ی مشکی خالص (هم‌رنگ لوگو) با هاله قرمز لوکس */}
          <div
            className="min-h-screen flex flex-col text-zinc-100 bg-black"
            style={{
              backgroundImage:
                `radial-gradient(40rem 40rem at 90% -10%, rgba(229,9,20,0.12), transparent 60%),
                 radial-gradient(30rem 30rem at -10% 110%, rgba(229,9,20,0.06), transparent 60%)`
            }}
          >
            <Header />

            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/tourism" element={<Tourism />} />
                <Route path="/dating" element={<Dating />} />
                <Route path="/metaverse" element={<Metaverse />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile" element={<Profile />} />

                {/* صفحات جدید */}
                <Route path="/whitepaper" element={<Whitepaper />} />
                <Route path="/farsicoin" element={<FarsiCoin />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
