import { useEffect, useRef, useState } from 'react'
import {
  SearchIcon,
} from '@heroicons/react/solid'
import { ArrowNarrowLeftIcon, ArrowNarrowRightIcon } from '@heroicons/react/solid'
import { getAllSupabaseUsers } from '../services/supabase'
import { search } from '../services/algolia'
import { classNames } from '../utils/index'
import axios from 'axios';

const perPage = 16;
export default function Users() {
    const [allUsers, setAllUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const [viewedUsers, setViewedUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
   
    const text = useRef(null);

    useEffect(() => {
      const users = axios.get('/api/users').then(res => 
        {
          const users = res.data.users;
        setAllUsers(users);
        setUsers(users);
        const slicedArray = users.slice(0, perPage);
        setViewedUsers(slicedArray);
      
        let pagesarray = [];
        for(let i=1 ; i<=Math.ceil(users.length / perPage); i++){
          pagesarray.push(i);
       }
      setPages(pagesarray);
      setLoading(false);
        }
      )
      
      }, [])

    useEffect(() => {
        const slicedArray = users.slice((currentPage - 1) * perPage + 1, currentPage * perPage + 1);
        setViewedUsers(slicedArray);
        if (pages[5] != 6 && !(currentPage > 5 && currentPage < pages.length - 3) && users.length == allUsers.length) {
          const newpg = pages;
          newpg[5] = 6;
          setPages(newpg);
        }
    }, [currentPage]);

    const nextPage = () => {
    if (pages.length !== currentPage) {
        
        if (currentPage > 4 && !(currentPage > pages.length - 4) ) {
            const newpg = pages;
            newpg[5] = currentPage + 1;
            setPages(newpg);
            setCurrentPage(currentPage + 1);
        } else {
        setCurrentPage(currentPage + 1);
    }
    }
    
    }

    const prevPage = () => {
        if (currentPage > 1) {
            if (currentPage > 6 && currentPage != 7 && !(currentPage >= pages.length - 2)) {
                const newpg = pages;
                newpg[5] = currentPage - 1;
                setPages(newpg);
                setCurrentPage(currentPage - 1);
            } 
            if (currentPage === 7) {
              const newpg = pages;
              newpg[5] = 6;
              setPages(newpg);
              setCurrentPage(currentPage - 1);
            }
        else {
            setCurrentPage(currentPage - 1);
        }
        }
    }

    const onChangeSearch = async () => {
      setCurrentPage(1);

        const username = text.current?.value.toLowerCase();
        if (username == '') {
          setUsers(allUsers);
          setViewedUsers(allUsers.slice(0, perPage));

          let pagesarray = [];
          for(let i=1 ; i<=Math.ceil(allUsers.length / perPage); i++){
            pagesarray.push(i);
        }
          setPages(pagesarray);
        } else {
          const searchResponse = await search(username);
          setUsers(searchResponse);
          setViewedUsers(searchResponse.slice(0, perPage));

          let pagesarray = [];
          for(let i=1 ; i<=Math.ceil(searchResponse.length / perPage); i++){
            pagesarray.push(i);
        }
        setPages(pagesarray);
      }
      }
    
  return (
      (loading ? <>loading...</> :
    <>
      <div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="w-full">
            <div className="relative z-10 flex-shrink-0 h-16 bg-white border-b border-gray-200 shadow-sm flex">

              <div className="flex-1 flex justify-between px-4 sm:px-6">
                <div className="flex-1 flex">
                  <form className="w-full flex md:ml-0" action="#" method="GET">
                    <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                      <div className=" absolute inset-y-0 left-0 flex items-center">
                        <SearchIcon className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
                      </div>
                      <input
                        onChange={() => onChangeSearch()}
                        ref={text}
                        className="hidden h-full w-full border-transparent py-2 pl-8 pr-3 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-transparent focus:placeholder-gray-400 sm:block"
                        placeholder="Search all users"
                        type="search"
                      />
                    </div>
                  </form>
                </div>
     
              </div>
            </div>
          </header>
          <div className="flex-1 flex items-stretch overflow-hidden">
            <main className="flex-1 overflow-y-auto justify-center	">
              <div className="pt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex">
                  <h1 className="flex-1 text-2xl font-bold text-gray-900">Users</h1>
                </div>

                <section className="mt-8 pb-16" aria-labelledby="gallery-heading">
                  <ul
                    role="list"
                    className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"
                  >
                      {viewedUsers.map((user, index) => (
                          <a href={`./u/${user.username}` }>
                      <li key={index} className="relative">
                        <div
                        >
                          <img
                            src={user.avatarUrl ? user.avatarUrl : 'https://explorer.farcaster.xyz/avatar.png'}
                            onError={({ currentTarget }) => {
                              currentTarget.onerror = null; 
                              currentTarget.src="https://explorer.farcaster.xyz/avatar.png";
                            }}
                          
                          
                            className={classNames(
                               'h-20'
                            )}
                          />
                        </div>
                        <p className="mt-2 block text-md font-medium text-gray-900 truncate pointer-events-none">
                        {user.displayName}
                        </p>
                        <p className={classNames("block font-medium text-gray-500 pointer-events-none", user.displayName ? "text-sm" : "text-md")}>@{user.username}</p>
                      </li>
                      </a>
                       ))} 
                  </ul>
                  {users.length < 1 && <>gm!! no users found :(</>}
                </section>
              </div>
              { users.length > 0 &&
      <nav className="flex max-w-3xl m-auto border-t border-gray-200">
        <a
          onClick={() =>  prevPage()}
          className={classNames("mx-auto cursor-pointer border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300")}
        >
          <ArrowNarrowLeftIcon
          className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
          Previous
        </a>
      <div className="mx-auto hidden md:-mt-px md:flex">

       {
       pages.map((page, index) => {
           if (index < 5) {
           return (
                <a
                href='#'
                  onClick={() => setCurrentPage(page)}
                  className={classNames("text-orange-500 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium", currentPage === page ? "border-orange-500" : '')}
                  aria-current="page"
                >
                  {page}
                </a>
           )
           } if (index === 5) {
               return (
                   <>
                   
                   <a
                href='#'
                  onClick={() => setCurrentPage(page)}
                  className={classNames("text-orange-500 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium", currentPage === page ? "border-orange-500" : '')}
                  aria-current="page"
                >
                  {page}
                </a>
                
<span className="border-transparent text-gray-500 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium">
          ...
        </span>
        </>
        )
           }

           if (index > pages.length - 5) { return (
            <a
            onClick={() => setCurrentPage(page)}
    
            className={classNames("cursor-pointer text-orange-500 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium", currentPage === page ? "border-orange-500" : '')}
            aria-current="page"
          >
            {page}
          </a>)
           }
       })}


      </div>
        <a
        onClick={() =>nextPage()}
          className="mx-auto cursor-pointer border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
        >
          Next
          <ArrowNarrowRightIcon className="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
        </a>
    </nav>
}
            </main>

          </div>
        </div>
      </div>

    </>)
  )
}
