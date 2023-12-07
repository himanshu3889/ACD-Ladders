import Image from "next/image";
import React from "react";

const about = () => {
  return (
    <div className="2xl:container 2xl:mx-auto pt-12 md:px-20 px-10 bg-gray-900 text-white">
      <div className="flex flex-col lg:flex-row justify-between gap-8">
        <div className="w-full lg:w-6/12 flex flex-col justify-center">
          <div className="pl-4 mb-6 border-l-4 border-blue-500 ">
            <span className="text-sm text-gray-200 uppercase ">
              Who we are?
            </span>
            <h1 className="mt-2 text-3xl text-white font-black md:text-5xl">
              About Us
            </h1>
          </div>
          <div className="font-normal text-base leading-6 text-white">
            <span className="font-bold">A Code Daily : </span> A dedicated
            nonprofit striving to empower individuals through the art and
            science of competitive programming and software development. <br />
            <br />
            At <span className="font-bold">A Code Daily</span>, we're committed
            to creating an inclusive space where individuals from diverse
            backgrounds can explore their passion for coding, problem-solving,
            and computer science. Whether you're a beginner eager to learn the
            fundamentals or an experienced coder aiming to enhance your
            expertise, our programs and resources cater to all skill levels.{" "}
            <br />
            <br />
            What sets us apart is our emphasis on competitive programming—a
            platform that not only sharpens coding abilities but also nurtures
            critical thinking, teamwork, and creativity. <br />
            <br />
            Our discord community serves as a hub for knowledge exchange,
            networking, and career development. We collaborate with industry
            experts, host guest lectures, and provide opportunities for our
            community to connect with professionals in the field, opening doors
            to internships, mentorships, and career pathways. <br />
            <br />
            Join us in our journey to cultivate a generation of tech-savvy
            problem solvers and innovators. Together, let's push the boundaries
            of possibility and shape the future through code.
          </div>
        </div>
        <div className="w-full lg:w-6/12 ">
          <img
            className="w-full h-full lg:py-24"
            src="https://i.ibb.co/FhgPJt8/Rectangle-116.png"
            alt="A group of People"
          />
        </div>
      </div>

      <div className="flex flex-col justify-between gap-8 mt-20">
        <div className="w-full flex flex-col justify-center">
          <div className="pl-4 mb-6 border-l-4 border-blue-500 ">
            <h1 className="mt-2 text-3xl text-white font-black md:text-5xl">
              Our Story
            </h1>
          </div>
          <p className="font-normal text-base leading-6 text-white ">
            It all began on January 1st, 2023, with a vision to provide free
            education and giving back to the community via means of competitive
            programming and software development.
            <br />
            <br />
            Starting as a humble initiative on YouTube,{" "}
            <span className="font-bold">A Code Daily</span> embarked on a
            journey to foster a space where tech enthusiasts, aspiring
            programmers, and seasoned developers could converge, learn, and grow
            together. Through informative videos, tutorials, and engaging
            content, the organization swiftly gained traction, drawing
            like-minded individuals eager to explore the realm of coding and
            problem-solving.
            <br />
            <br />
            As the community flourished and the desire to facilitate deeper
            interactions grew, the focus shifted towards Discord. This
            transition marked a pivotal moment, enabling real-time
            communication, collaboration, and a more immersive learning
            experience for our members.
            <br />
            Today, we stand proud with a thriving community of around 6,000
            members, solidifying our position as the largest active community
            dedicated to competitive programming and software development in
            India. Our growth speaks volumes about the commitment, dedication,
            and passion of each member who has contributed to making A Code
            Daily a hub of learning, networking, and innovation.
            <br />
            <br />
            We take pride in the diverse talents, ideas, and collaborative
            spirit that define us. From hosting competitions, workshops, and
            mentoring sessions to forging connections with industry experts,
            <span className="font-bold">A Code Daily</span> continues to be a
            catalyst for learning and growth, empowering individuals to carve
            their path in the ever-evolving tech landscape.
            <br />
            <br />
            The journey from a YouTube channel to a thriving Discord community
            has been an incredible testament to our shared enthusiasm for coding
            excellence, problem-solving, and technological innovation. As we
            look towards the future, we remain committed to expanding our
            horizons, embracing new challenges, and empowering even more
            individuals to excel in the world of programming and software
            development.
            <br />
            <br />
            Join us in our ongoing saga—a story woven by passion, dedication,
            and the collective pursuit of technological excellence.
          </p>
        </div>
        <div className="w-full lg:pt-8">
          <div className="grid sm:grid-cols-2 grid-cols-1 lg:gap-4 shadow-lg rounded-md">
            <div className="p-4 pb-6 flex justify-center flex-col items-center">
              <Image
                className="md:block hidden w-auto h-auto"
                src="/Pranav_Mehta.jpg"
                alt="Pranav Mehta featured Img"
                width={170}
                height={170}
              />
              <Image
                className="md:hidden block w-auto h-auto"
                src="/Pranav_Mehta.jpg"
                alt="Pranav Mehta featured Img"
                width={170}
                height={170}
              />
              <p className="font-medium text-xl leading-5 text-gray-100 mt-4">
                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  className="hover:text-blue-500"
                >
                  Pranav Mehta
                </a>
              </p>
              <p className="text-xs leading-5 text-gray-100 mt-1">
                (ACD Founder)
              </p>
            </div>
            <div className="p-4 pb-6 flex justify-center flex-col items-center">
              <Image
                className="md:block hidden w-auto h-auto"
                src="/Himanshu_Rajput.jpg"
                alt="Himanshu Rajput featured Img"
                width={170}
                height={170}
              />
              <Image
                className="md:hidden block w-auto h-auto"
                src="/Himanshu_Rajput.jpg"
                alt="Himanshu Rajput featured Img"
                width={170}
                height={170}
              />
              <p className="font-medium text-xl leading-5 text-gray-100 mt-4">
                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  className="hover:text-blue-500"
                >
                  Himanshu Rajput
                </a>
              </p>
              <p className="text-xs leading-5 text-gray-100 mt-1">
                (ACD Member)
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-10 md:gap-40 py-24 max-w-7xl md:grid-cols-2">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-12 h-12 mb-4 text-purple-700"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <h3 className="mb-3 text-xl font-medium leading-tight text-orange-400">
            Free Education
          </h3>
          <p className="text-base leading-relaxed text-gray-100">
            Emphasize the commitment to providing free education on DSA and
            competetive programming, making coding accessible to everyone.
            Highlight the inclusive space you've created, welcoming individuals
            from diverse backgrounds.
          </p>
        </div>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-12 h-12 mb-4 text-purple-700"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
            />
          </svg>
          <h3 className="mb-3 text-xl font-medium leading-tight text-orange-400">
            Grow with the community
          </h3>
          <p className="text-base leading-relaxed text-gray-100">
            Engage in real-time discussions, problem-solving sessions, and
            knowledge-sharing with fellow enthusiasts on our{" "}
            <a
              href="https://discord.gg/ymBgMYvJb4"
              className="font-semibold text-blue-400"
            >
              discord server
            </a>{" "}
            and{" "}
            <a
              href="https://www.youtube.com/@GrindCoding"
              className="font-semibold text-blue-400"
            >
              Youtube channel
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default about;
