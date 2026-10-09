import { useEffect, useState } from "react";

// IMPORTANT: This is the same API used by your original frontend.
// Vite sends /api requests to your existing Express server on port 5000.
const API_URL = "http://localhost:5000/api/books";

const initialForm = {
    title: "",
    author: "",
    category: "",
    price: "",
    quantity: ""
};

function App() {
    const [books, setBooks] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [editId, setEditId] = useState(null);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    // GET /api/books
    async function getBooks() {
        try {
            setLoading(true);
            const response = await fetch(API_URL);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Error fetching books");
            }

            setBooks(data);
        } catch (error) {
            console.error(error);
            alert("Unable to fetch books");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getBooks();
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value
        }));
    }

    // POST /api/books OR PUT /api/books/:id
    async function handleSubmit(event) {
        event.preventDefault();

        const bookData = {
            title: form.title,
            author: form.author,
            category: form.category,
            price: Number(form.price),
            quantity: Number(form.quantity)
        };

        try {
            const url = editId ? `${API_URL}/${editId}` : API_URL;
            const method = editId ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bookData)
            });

            const result = await response.json();

            if (!response.ok) {
                alert(result.message);
                return;
            }

            alert(result.message);
            resetForm();
            getBooks();
        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        }
    }

    function editBook(id) {
        const book = books.find((item) => item._id === id);

        if (!book) return;

        setForm({
            title: book.title,
            author: book.author,
            category: book.category,
            price: book.price,
            quantity: book.quantity
        });

        setEditId(id);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    // DELETE /api/books/:id
    async function deleteBook(id) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this book?"
        );

        if (!confirmed) return;

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            });

            const result = await response.json();

            alert(result.message);
            getBooks();
        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        }
    }

    function resetForm() {
        setForm(initialForm);
        setEditId(null);
    }

    const filteredBooks = books.filter((book) => {
        const value = search.toLowerCase();

        return (
            book.title.toLowerCase().includes(value) ||
            book.author.toLowerCase().includes(value) ||
            book.category.toLowerCase().includes(value)
        );
    });

    return (
        <div className="min-h-screen bg-[#f4f6f8] px-4 py-8 sm:px-8">
            <div className="mx-auto max-w-6xl">
                <h1 className="mb-8 text-center text-3xl font-bold text-slate-800 sm:text-4xl">
                    Library Management System
                </h1>

                {/* FORM */}
                <section className="rounded-xl bg-white p-6 shadow-md">
                    <h2 className="mb-5 text-2xl font-bold text-slate-800">
                        {editId ? "Edit Book" : "Add New Book"}
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 gap-4 md:grid-cols-2"
                    >
                        <Input
                            name="title"
                            placeholder="Book Title"
                            value={form.title}
                            onChange={handleChange}
                        />
                        <Input
                            name="author"
                            placeholder="Author"
                            value={form.author}
                            onChange={handleChange}
                        />
                        <Input
                            name="category"
                            placeholder="Category"
                            value={form.category}
                            onChange={handleChange}
                        />
                        <Input
                            name="price"
                            type="number"
                            placeholder="Price"
                            value={form.price}
                            onChange={handleChange}
                        />
                        <Input
                            name="quantity"
                            type="number"
                            placeholder="Quantity"
                            value={form.quantity}
                            onChange={handleChange}
                        />

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="flex-1 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                            >
                                {editId ? "Update Book" : "Add Book"}
                            </button>

                            {editId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="rounded-lg bg-slate-500 px-5 py-3 font-semibold text-white hover:bg-slate-600"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </section>

                {/* SEARCH */}
                <div className="my-8">
                    <input
                        type="text"
                        placeholder="Search books..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-4 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                <h2 className="mb-5 text-2xl font-bold text-slate-800">
                    Books List
                </h2>

                {loading ? (
                    <p className="rounded-xl bg-white p-8 text-center text-slate-500 shadow-md">
                        Loading books...
                    </p>
                ) : filteredBooks.length === 0 ? (
                    <p className="rounded-xl bg-white p-8 text-center text-slate-500 shadow-md">
                        No books found.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {filteredBooks.map((book) => (
                            <div
                                key={book._id}
                                className="rounded-xl bg-white p-5 shadow-md"
                            >
                                <h3 className="mb-3 text-xl font-bold text-blue-600">
                                    {book.title}
                                </h3>

                                <p className="my-2 text-slate-600">
                                    <strong>Author:</strong> {book.author}
                                </p>
                                <p className="my-2 text-slate-600">
                                    <strong>Category:</strong> {book.category}
                                </p>
                                <p className="my-2 text-slate-600">
                                    <strong>Price:</strong> ₹{book.price}
                                </p>
                                <p className="my-2 text-slate-600">
                                    <strong>Quantity:</strong> {book.quantity}
                                </p>

                                <div className="mt-5 flex gap-3">
                                    <button
                                        onClick={() => editBook(book._id)}
                                        className="flex-1 rounded-lg bg-amber-500 px-4 py-2.5 font-semibold text-white hover:bg-amber-600"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => deleteBook(book._id)}
                                        className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 font-semibold text-white hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function Input({ name, type = "text", placeholder, value, onChange }) {
    return (
        <input
            required
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
    );
}

export default App;
