import React from 'react';
import type { Lang } from '@/lib/i18n';
import type { CategoryId } from '@/types';
import { ShieldCheck, Zap, AlertTriangle, CheckCircle, Info, Sparkles, HelpCircle } from 'lucide-react';
import type { CategoryFaq } from '@/data/category-faqs';

export interface CategoryContentSection {
  title: string;
  content: string;
  listItems?: string[];
  callout?: {
    type: 'info' | 'warning' | 'success';
    text: string;
  };
}

export interface CategoryContentBlockProps {
  categoryId: CategoryId | string;
  lang: Lang;
  h2Title?: string;
  leadParagraph?: string;
  sections?: CategoryContentSection[];
  faqItems?: CategoryFaq[];
}

export function CategoryContentBlock({
  categoryId,
  lang,
  h2Title,
  leadParagraph,
  sections,
  faqItems = [],
}: CategoryContentBlockProps) {
  const isZh = lang === 'zh';

  // Build FAQPage JSON-LD schema if FAQ items exist
  const faqSchema =
    faqItems.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqItems.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        }
      : null;

  return (
    <div className="space-y-12">
      {/* FAQPage Structured Data Injection */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Rich SEO & Guide Content Block */}
      {(h2Title || leadParagraph || (sections && sections.length > 0)) && (
        <section className="section-container">
          <div className="rounded-2xl bg-[#0D1526] border border-[#1E2D45] p-6 sm:p-8 md:p-12 shadow-xl relative overflow-hidden">
            {/* Ambient Background Accent */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#00E5FF]/5 rounded-full blur-3xl pointer-events-none" />

            {/* Header / Title */}
            {h2Title && (
              <div className="mb-6 border-b border-[#1E2D45] pb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-xs font-bold uppercase tracking-wider mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  {isZh ? '官方选购与使用指南' : 'OFFICIAL BUYING & SAFETY GUIDE'}
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F0F4FF] tracking-tight">
                  {h2Title}
                </h2>
              </div>
            )}

            {/* Lead Paragraph */}
            {leadParagraph && (
              <p className="text-sm sm:text-base text-[#7B91B0] leading-relaxed mb-8 max-w-3xl">
                {leadParagraph}
              </p>
            )}

            {/* Custom Sections */}
            {sections && sections.length > 0 && (
              <div className="space-y-8">
                {sections.map((section, idx) => (
                  <div key={idx} className="space-y-3">
                    <h3 className="text-lg sm:text-xl font-bold text-[#F0F4FF] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#00E5FF]" />
                      {section.title}
                    </h3>
                    <p className="text-sm text-[#7B91B0] leading-relaxed">
                      {section.content}
                    </p>

                    {section.listItems && section.listItems.length > 0 && (
                      <ul className="space-y-2 mt-3 pl-2">
                        {section.listItems.map((item, itemIdx) => (
                          <li
                            key={itemIdx}
                            className="flex items-start gap-2.5 text-sm text-[#F0F4FF]"
                          >
                            <CheckCircle className="w-4 h-4 text-[#07C160] shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.callout && (
                      <div
                        className={`mt-4 p-4 rounded-xl border flex items-start gap-3 ${
                          section.callout.type === 'warning'
                            ? 'bg-[#FF0036]/10 border-[#FF0036]/30 text-[#FF2D55]'
                            : section.callout.type === 'success'
                            ? 'bg-[#07C160]/10 border-[#07C160]/30 text-[#07C160]'
                            : 'bg-[#00E5FF]/10 border-[#00E5FF]/30 text-[#00E5FF]'
                        }`}
                      >
                        {section.callout.type === 'warning' ? (
                          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                        ) : section.callout.type === 'success' ? (
                          <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
                        ) : (
                          <Info className="w-5 h-5 shrink-0 mt-0.5" />
                        )}
                        <p className="text-xs sm:text-sm font-medium leading-relaxed">
                          {section.callout.text}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Standard Security Guarantee Banner */}
            <div className="mt-10 pt-6 border-t border-[#1E2D45] flex flex-wrap items-center justify-between gap-4 text-xs text-[#7B91B0]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#07C160]" />
                <span className="font-semibold text-[#F0F4FF]">
                  {isZh ? '72小时极速换号质保' : '72-Hour Free Replacement Warranty'}
                </span>
                <span>•</span>
                <span>{isZh ? '100% 实名合规资质' : '100% Verified Identities'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#00E5FF]" />
                <span>{isZh ? 'USDT 付款后 5 分钟自动发货' : '< 5 Min Automated Crypto Delivery'}</span>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
