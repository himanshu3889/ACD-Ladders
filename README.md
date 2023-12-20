# ACD Ladders
Hi Coders, ACD Ladders empowers user to enhance their programming skills. It allows users to efficiently filter Codeforces problems based on various criteria, providing a more personalized approach to problem selection.<br/>
ACD Ladders employs advanced techniques such as maps, sets, pointers and string algorithms . This seamless integration of these programming fundamentals enhances the app's efficiency in filtering problems.




### Built With
* [![Next][Next.js]][Next-url]
* [![React][React.js]][React-url]
* [![Tailwind Css][tailwindcss.com]][TailwindCss-url]


## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have the following prerequisites installed on your machine:

- [Node.js](https://nodejs.org/): Next.js is built on top of Node.js, so you need to have Node.js installed. You can download and install it from [nodejs.org](https://nodejs.org/).



### Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/himanshu3889/ACD-Ladders/
    ```

2. Navigate to the project directory:

    ```sh
    cd ACD-Ladders
    ```

3. Install dependencies:

    ```sh
    npm install
    ```




### Environment Variables

The following environment variables are required for configuring the project:

1. **NEXT_PUBLIC_BASE_URL**
   - Description: Specifies the base URL for the project.
   - Example: `http://localhost:3000`

2. **NEXT_PUBLIC_CODEFORCES_API**
   - Description: Specifies the Codeforces API URL.
   - Example: `https://codeforces.com/api`

3. **NEXT_PUBLIC_ACD_LADDERS_API**
   - Description: Specifies the ACD Ladders API URL.
   - Example: `https://acodedaily.com/api/v2/`

### Setting up Environment Variables

To set up the required environment variables, follow these steps:

1. Open your project's codebase.

2. Locate the configuration file or the place where environment variables are set (.env.development).

3. Add the following lines to set the required variables:

   ```
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   NEXT_PUBLIC_CODEFORCES_API=https://codeforces.com/api
   NEXT_PUBLIC_ACD_LADDERS_API = https://acodedaily.com/api/v2/
   ```



### Run the Development Server

Once the installation is complete, you can run the development server:

```sh
npm run dev
```

This will start the Next.js development server, and you can view your app by visiting http://localhost:3000 in your web browser.




## Usage

### Filtering Problems


1. **Enter Criteria:**
   Specify your filtering criteria, such as difficulty, Index, SolvedBy, Contest Type, tags, OR (problem will have atleast one of the tag present instead of all) / Exclude (problems will not have any of the selected tags present) & problem of the status in the provided input fields.

2. **Apply Filters:**
   Click the "Apply Filters" button to filter Codeforces problems based on your specified criteria.

3. **Enter Your Codeforces ID (Optional):**
   By entering the Codeforces ID you can see status of the problems in the problems sidebar (Grey : unsolved, Green : Solved & Red : Attempted) and user can filter the problems by their required problem status.

### Sorting Results

- **Sort by Id:**
  Click on the Id(in table head) to sort filtered problems by Id.

- **Sort by SolvedBy(for cf_filter):**
  Click on the SolvedBy(in table head) to arrange filtered problems by solved count.

- **Sort by Difficulty:**
  Click on the Difficulty(in table head) to arrange filtered problems by difficulty level.


### Additional Features

- **Toggle and Clear Tags:**
  can toggle the tags and clear the tags

- **Saved Filters:**
  can rename, delete and save the filter

- **Toggle Filter SideBar:**
  can toggle the filter sidebar by cliking on the fixed button on the right hand side of the mid screen

- **Notifications:**
  showing notifications for various activities




## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



## License

Distributed under the MIT License. See `LICENSE.txt` for more information.




[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[tailwindcss.com]: https://img.shields.io/badge/tailwindcss-0F172A?&logo=tailwindcss
[tailwindcss-url]: https://tailwindcss.com/
