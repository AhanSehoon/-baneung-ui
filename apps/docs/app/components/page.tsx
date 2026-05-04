import Link from 'next/link';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Heading,
  Lead,
  Muted,
  Separator,
} from '@baneung-pack/ui';

import { componentMetadata, metaByCategory } from '@/lib/components-metadata';

export default function ComponentsIndexPage() {
  const groups = metaByCategory();
  const categories = Array.from(groups.keys());

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Heading level={1}>컴포넌트</Heading>
        <Lead>
          {componentMetadata.length}개의 컴포넌트. 각 페이지에는 라이브 예제와 props API 표가
          포함됩니다.
        </Lead>
      </header>

      <Separator />

      <div className="flex flex-col gap-10">
        {categories.map((category) => {
          const items = groups.get(category)!;
          return (
            <section key={category} className="flex flex-col gap-3">
              <div className="flex items-baseline justify-between">
                <Heading level={2} className="text-2xl">
                  {category}
                </Heading>
                <Muted className="text-xs">{items.length}개</Muted>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((meta) => (
                  <Link
                    key={meta.slug}
                    href={`/components/${meta.slug}`}
                    className="block transition-colors duration-fast ease-standard hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <Card variant="outlined" className="h-full">
                      <CardHeader>
                        <CardTitle className="text-base">{meta.title}</CardTitle>
                        <CardDescription className="text-xs leading-relaxed line-clamp-2">
                          {meta.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
