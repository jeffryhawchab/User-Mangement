
export type user={
    name: string,
    email: string,
    status: string,
    date: string,

};


export const Card = ({name, email, status, date}:user) => {
    return (
        <div className="bg-white shadow-md rounded p-4 justify-center space-y-3">
            <div className="flex justify-center">
                <h1 className="bg-[#3251D0] rounded-full flex items-center justify-center text-lg h-16 w-16 font-bold text-white">{name.split(" ").map((text: string) => text[0]).join("").toUpperCase()}</h1>
            </div>
            <h2 className="font-bold text-lg mb-2">{name}</h2>
            <div>
                <p className="text-gray-500 text-sm">Email: {email}</p>
                <p className="text-gray-500 text-sm">Status: {status}</p>
                <p className="text-gray-500 text-sm">Date of Birth: {date}</p>
            </div>
            <div className="flex justify-end  ">
            <button className="bg-[#3251D0] hover:bg-[#3c5cff] w-15 h-9 rounded text-amber-50 hover- m-2">Edit</button>
            <button className="bg-red-500 w-24 h-9 hover:bg-red-600 rounded text-amber-50 m-2">Delete</button>
            </div>
        </div>
    )
}