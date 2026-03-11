"use client";

import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function LandingHero() {
  return (
    <AuroraBackground className="min-h-[72vh]">
      <div className="mx-auto flex min-h-[72vh] max-w-3xl items-center px-4 py-16 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full rounded-3xl border border-white/30 bg-white/65 p-6 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/60 md:p-10"
        >
          <div className="mb-3 inline-flex rounded-full border border-black/5 bg-white/70 px-3 py-1 text-xs text-slate-600 dark:border-white/10 dark:bg-zinc-900/70 dark:text-zinc-300">
            사주 x MBTI 결과 서비스
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-5xl">
            당신의 사주를,
            <br />더 읽기 쉬운 구조로
          </h1>
          <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-zinc-300 md:text-base md:leading-7 max-w-lg">
            이름, 생년월일시, MBTI를 입력하면 사주 계산 결과를 구조화해
            보여드립니다. 지금은 계산 기반 목업 리포트를 우선 제공합니다.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/report/new"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
            >
              사주 결과 보기
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </AuroraBackground>
  );
}
