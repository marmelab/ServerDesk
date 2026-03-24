import React from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export const PageHeader = ({
  title,
  description,
  children,
}: PageHeaderProps) => {
  return (
    <header className="flex w-full items-center justify-between mb-12">
      <div className="flex flex-col gap-1 text-left">
        <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
          {title}
        </h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {children && <div>{children}</div>}
    </header>
  );
};
