import { Button } from '@/components/ui/button';
import Link from 'next/link';

function EmptyList({
  heading = 'No items in the list.',
  message = 'Keep exploring our properties',
  btnText = 'back home',
}: {
  heading?: string;
  message?: string;
  btnText?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 py-8">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{heading}</h2>
        <p className="text-lg mb-6 text-gray-600">{message}</p>
        <Button asChild className="mt-4 capitalize bg-purple-600 text-white hover:bg-purple-700" size="lg">
          <Link href="/services">{btnText}</Link>
        </Button>
      </div>
    </div>
  );
}

export default EmptyList;
