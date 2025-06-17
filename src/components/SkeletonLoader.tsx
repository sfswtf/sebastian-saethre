import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

export const EventCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <Skeleton className="h-48 w-full" />
    <div className="p-6 space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-10 w-1/3" />
    </div>
  </div>
);

export const GallerySkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, index) => (
      <div key={index} className="aspect-w-4 aspect-h-3">
        <Skeleton className="w-full h-full rounded-lg" />
      </div>
    ))}
  </div>
);

export const HeroSkeleton = () => (
  <div className="relative h-screen">
    <Skeleton className="absolute inset-0" />
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-start items-center pt-20">
      <Skeleton className="w-[20rem] sm:w-[28rem] md:w-[32rem] h-[20rem] sm:h-[28rem] md:h-[32rem] rounded-full mb-4" />
      <div className="text-center mx-auto max-w-3xl">
        <Skeleton className="h-6 w-3/4 mx-auto mb-6" />
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
          <Skeleton className="h-12 w-[180px]" />
          <Skeleton className="h-12 w-[180px]" />
        </div>
      </div>
    </div>
  </div>
);

export const ContactFormSkeleton = () => (
  <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
    <Skeleton className="h-8 w-1/4" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-8 w-1/4" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-8 w-1/4" />
    <Skeleton className="h-32 w-full" />
    <Skeleton className="h-12 w-full" />
  </div>
);

export const MembershipFormSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
    <Skeleton className="h-8 w-1/3" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-12 w-full" />
  </div>
); 