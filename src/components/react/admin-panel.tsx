import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Component() {
  const [services, setServices] = useState([
    {
      title: "Web Design",
      price: 1500,
      description:
        "Crafting beautiful and responsive websites that engage your audience.",
    },
    {
      title: "Digital Marketing",
      price: 2000,
      description:
        "Developing and executing effective digital marketing strategies to grow your business.",
    },
    {
      title: "Branding",
      price: 1800,
      description: "Helping you build a strong and memorable brand identity.",
    },
    {
      title: "IT Support",
      price: 1200,
      description:
        "Providing reliable and efficient IT support to keep your business running smoothly.",
    },
    {
      title: "Consulting",
      price: 2500,
      description:
        "Offering expert guidance and strategic advice to help you achieve your business goals.",
    },
    {
      title: "Training",
      price: 1000,
      description:
        "Empowering your team with the skills and knowledge they need to succeed.",
    },
  ]);
  const [testimonials, setTestimonials] = useState([
    {
      name: "Sarah Lee",
      title: "CEO, Acme Corp",
      image: "/avatars/04.png",
      quote:
        "The team at Acme Services has been instrumental in transforming our online presence and driving growth for our business. Highly recommended!",
    },
    {
      name: "David Kim",
      title: "Founder, Startup X",
      image: "/avatars/05.png",
      quote:
        "Acme Services has been a true partner in our journey. Their expertise and attention to detail have been invaluable in helping us achieve our goals.",
    },
    {
      name: "Emily Chen",
      title: "Marketing Manager, Acme Inc",
      image: "/avatars/06.png",
      quote:
        "Acme Services has been a game-changer for our marketing efforts. Their digital marketing strategies have helped us reach new heights and connect with our target audience.",
    },
  ]);
  const [editingService, setEditingService] = useState<number | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [editingCompany, setEditingCompany] = useState(false);
  const [companyName, setCompanyName] = useState("Acme Services");
  const [companyDescription, setCompanyDescription] = useState(
    "Providing top-quality services to businesses and individuals since 2010.",
  );
  const handleServiceEdit = (index: number) => {
    setEditingService(index);
  };
  const handleServiceSave = (index, service) => {
    const updatedServices = [...services];
    updatedServices[index] = service;
    setServices(updatedServices);
    setEditingService(null);
  };
  const handleTestimonialEdit = (index) => {
    setEditingTestimonial(index);
  };
  const handleTestimonialSave = (index, testimonial) => {
    const updatedTestimonials = [...testimonials];
    updatedTestimonials[index] = testimonial;
    setTestimonials(updatedTestimonials);
    setEditingTestimonial(null);
  };
  const handleAddService = () => {
    setServices([
      ...services,
      {
        title: "New Service",
        price: 0,
        description: "Add a description for your new service.",
      },
    ]);
    setEditingService(services.length);
  };
  const handleAddTestimonial = () => {
    setTestimonials([
      ...testimonials,
      {
        name: "New Testimonial",
        title: "Add a title",
        image: "/placeholder-user.jpg",
        quote: "Add a quote from your customer.",
      },
    ]);
    setEditingTestimonial(testimonials.length);
  };
  const handleCompanyEdit = () => {
    setEditingCompany(true);
  };
  const handleCompanySave = () => {
    setEditingCompany(false);
  };
  return (
    <main className="flex-1">
      <section className="w-full pt-12 md:pt-24 lg:pt-32 border-y">
        <div className="px-4 md:px-6 space-y-10 xl:space-y-16">
          <div className="grid max-w-[1300px] mx-auto gap-4 px-4 sm:px-6 md:px-10 md:grid-cols-2 md:gap-16">
            <div>
              <div className="flex items-center gap-4">
                <img
                  src="/placeholder.svg"
                  width="48"
                  height="48"
                  alt="Logo"
                  className="aspect-square overflow-hidden rounded-lg object-contain object-center"
                />
                {editingCompany ? (
                  <div className="grid gap-2">
                    <Input
                      defaultValue={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                    <Textarea
                      defaultValue={companyDescription}
                      onChange={(e) => setCompanyDescription(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleCompanySave} className="flex-1">
                        Save
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setEditingCompany(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                      {companyName}
                    </h1>
                    <p className="mt-4 text-gray-500 md:text-xl dark:text-gray-400">
                      {companyDescription}
                    </p>
                    <Button onClick={handleCompanyEdit} className="mt-4">
                      Edit
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container space-y-12 px-4 md:px-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Our Services
            </h2>
            <p className="mt-4 max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              We offer a wide range of services to meet your business needs.
            </p>
            <Button onClick={handleAddService} className="mt-4">
              Add Service
            </Button>
          </div>
          <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
            {services.map((service, index) => (
              <div key={index} className="grid gap-1">
                {editingService === index ? (
                  <div className="grid gap-2">
                    <Input
                      defaultValue={service.title}
                      onChange={(e) =>
                        handleServiceSave(index, {
                          ...service,
                          title: e.target.value,
                        })
                      }
                    />
                    <Textarea
                      defaultValue={service.description}
                      onChange={(e) =>
                        handleServiceSave(index, {
                          ...service,
                          description: e.target.value,
                        })
                      }
                    />
                    <Input
                      type="number"
                      defaultValue={service.price}
                      onChange={(e) =>
                        handleServiceSave(index, {
                          ...service,
                          price: parseInt(e.target.value),
                        })
                      }
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleServiceSave(index, service)}
                        className="flex-1"
                      >
                        Save
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setEditingService(null)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold">{service.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {service.description}
                      </p>
                    </div>
                    <span className="text-lg font-bold">${service.price}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleServiceEdit(index)}
                    >
                      <PenIcon className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
        <div className="container space-y-12 px-4 md:px-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              What Our Clients Say
            </h2>
            <p className="mt-4 max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Hear from our satisfied customers about their experience with our
              services.
            </p>
            <Button onClick={handleAddTestimonial} className="mt-4">
              Add Testimonial
            </Button>
          </div>
          <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="flex flex-col items-start space-y-4 rounded-lg bg-gray-100 p-6 dark:bg-gray-800"
              >
                {editingTestimonial === index ? (
                  <div className="grid gap-2">
                    <Input
                      defaultValue={testimonial.name}
                      onChange={(e) =>
                        handleTestimonialSave(index, {
                          ...testimonial,
                          name: e.target.value,
                        })
                      }
                    />
                    <Input
                      defaultValue={testimonial.title}
                      onChange={(e) =>
                        handleTestimonialSave(index, {
                          ...testimonial,
                          title: e.target.value,
                        })
                      }
                    />
                    <Textarea
                      defaultValue={testimonial.quote}
                      onChange={(e) =>
                        handleTestimonialSave(index, {
                          ...testimonial,
                          quote: e.target.value,
                        })
                      }
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() =>
                          handleTestimonialSave(index, testimonial)
                        }
                        className="flex-1"
                      >
                        Save
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setEditingTestimonial(null)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <img
                        src="/placeholder.svg"
                        width="48"
                        height="48"
                        alt="Client"
                        className="rounded-full"
                      />
                      <div>
                        <h3 className="text-lg font-bold">
                          {testimonial.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {testimonial.title}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.quote}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleTestimonialEdit(index)}
                    >
                      <PenIcon className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function PenIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
  );
}
