import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState({});
  const [answers, setAnswers] = useState({ answer1: '', answer2: '' });
  const [password, setPassword] = useState(''); // State to store the password
  const [countdown, setCountdown] = useState(10); // Countdown timer for redirecting
  const navigate = useNavigate();

  useEffect(() => {
    if (step === 3 && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prevCountdown => {
          if (prevCountdown === 1) {
            clearInterval(timer);
            navigate('/login'); // Redirect to login page after countdown.
          }
          return prevCountdown - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, countdown, navigate]);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleAnswerChange = (e) => {
    setAnswers({ ...answers, [e.target.name]: e.target.value });
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/forgot-password', { email });
      if (response.data.questions) {
        setQuestions(response.data.questions);
        setStep(2);
      } else {
        setError('Email not found.');
      }
    } catch (error) {
      setError('Error retrieving recovery questions.');
    }
  };

  const handleSubmitAnswers = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/verify-answers', { email, answers });
      if (response.data.correct) {
        setPassword(response.data.password); // Store the password
        setMessage('Password has been retrieved.');
        setStep(3); // Proceed to the final step
      } else {
        setError('Incorrect answers. Please try again.');
      }
    } catch (error) {
      setError('Error verifying answers.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        {step === 1 && (
          <>
            <h1 className="text-2xl font-bold mb-6">Forgot Password</h1>
            {message && <p className="text-green-500">{message}</p>}
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmitEmail}>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                Next
              </button>
            </form>
          </>
        )}
        {step === 2 && (
          <>
            <h1 className="text-2xl font-bold mb-6">Answer Recovery Questions</h1>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmitAnswers}>
              <div className="mb-4">
                <label className="block text-gray-700">{questions.question1}</label>
                <input
                  type="text"
                  name="answer1"
                  value={answers.answer1}
                  onChange={handleAnswerChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">{questions.question2}</label>
                <input
                  type="text"
                  name="answer2"
                  value={answers.answer2}
                  onChange={handleAnswerChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                Submit
              </button>
            </form>
          </>
        )}
        {step === 3 && (
          <>
            <h1 className="text-2xl font-bold mb-6">Password Retrieved</h1>
            <p className="text-green-500">
              Your password is: <strong>{password}</strong>
            </p>
            <p className="text-gray-700">
              Redirecting to login page in {countdown} seconds...
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
