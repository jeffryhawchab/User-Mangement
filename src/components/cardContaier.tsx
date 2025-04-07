
import { Card, user } from "./CardUI";

export const Cardcontainer = () => {
    const cardArr: user[] = [
        {name: "John Doe",email: "john.doe@example.com",status: "active",date: "1990-05-15"},
        {name: "Jane Smith",email: "jane.smith@example.com",status: "locked",date: "1988-10-22"},
        {name: "Bob",email: "bob.martin@example.com",status: "locked",date: "1995-02-10"},
        {name: "Charlie Brown",email: "charlie.brown@example.com",status: "active",date: "1992-11-30"},
        {name: "David Lee",email: "david.lee@example.com",status: "locked",date: "1987-07-14"},
        {name: "Eve",email: "david.lee@example.com",status: "locked",date: "1987-07-14"},
        {name: "Alice Johnson",email: "david.lee@example.com",status: "active",date: "1987-07-14"},
        {name: "Frank White",email: "frank.white@example.com",status: "active",date: "1994-01-25"},
    ];
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 m-4">
           {cardArr.map((userDetails:user)=><Card {...userDetails}/>)} 
        </div>
    )
}
