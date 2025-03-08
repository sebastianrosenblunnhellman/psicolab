'use client';

import Quiz from '@/components/Quiz';

const components = {
  Quiz,
};

export function useMDXComponents(components: any) {
  return {
    ...components,
  };
}