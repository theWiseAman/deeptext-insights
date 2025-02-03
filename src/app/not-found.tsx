import Link from 'next/link'

const NotFound = () => {
	return (
		<section className='flex flex-col h-screen w-screen items-center justify-center max-h-full max-w-full place-items-center bg-inherit text-white'>
			<div className='text-center'>
				<h2 className='text-2xl sm:text-4xl font-semibold text-indigo-600'>
					404
				</h2>
				<h1 className='mt-4 text-3xl font-bold tracking-tight sm:text-5xl'>
					Page not found
				</h1>
				<p className='mt-6 text-base leading-7 text-gray-200'>
					Sorry, we couldn’t find the page you’re looking for.
				</p>
				<div className='mt-10 flex items-center justify-center gap-x-6'>
					<Link
						href='/'
						className='rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
					>
						Go back home
					</Link>
				</div>
			</div>
		</section>
	)
}

export default NotFound
