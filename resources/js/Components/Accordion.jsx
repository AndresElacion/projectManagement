import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/20/solid'

export default function Accordion({ title, content }) {
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <DisclosureButton className="flex px-4 py-2 text-sm font-medium text-left text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
            <span>{title}</span>
            <ChevronUpIcon
              className={`${open ? 'transform rotate-180' : ''} w-5 h-5 text-purple-500`}
            />
          </DisclosureButton>
          <DisclosurePanel className="px-4 pt-4 pb-2 text-sm text-gray-500">
            {content}
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
