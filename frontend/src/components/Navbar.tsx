import React from "react";

const Navbar = () => {
    return (
        <div className="flex justify-between m-2 p-1">
            <div>
                {/* <img
                    src={Logo}
                    alt="Expenssy"
                    className="h-15 w-auto object-contain"
                /> */}
                Doci
            </div>
            <div className="flex justify-around">
                {/* {isAuthenticated ? ( */}
                <div className="flex justify-center items-center gap-2">
                    <div>
                        {/* <Avatar
                                alt="Name"
                                // src="/static/images/avatar/1.jpg"
                            /> */}
                    </div>
                    <div>
                        <button>Logout</button>
                    </div>
                </div>
                {/* ) : (
                    <div className="flex justify-center gap-2">
                        <div className="m-2 p-2 flex items-center justify-center rounded-md hover:bg-gray-100">
                            <Link to={"/signIn"}>Sign In</Link>
                        </div>
                        <div className="m-2 p-2 flex items-center justify-center bg-blue-600 text-white rounded-md hover:bg-blue-600">
                            <Link to={"/signUp"}>Sign Up</Link>
                        </div>
                    </div>
                )} */}
            </div>
        </div>
    );
};

export default Navbar;
