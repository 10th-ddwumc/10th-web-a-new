interface TodoFormProps{
    input: string;
    setInput: (input: string) => void;
    handleSubmit: (e:React.FormEvent<HTMLFormElement>) => void;
}

import React from 'react';

const TodoForm = ({input,setInput,handleSubmit}:TodoFormProps) => {
    return <div>
    <form onSubmit={handleSubmit} className='todo-conatainer__form'>
        <input
        value={input}
        onChange={(e): void => setInput(e.target.value)}
        type='text'
        className='todo-container__input'
        placeholder="할일 입력"
        required
        />
        <button type='submit' className="todo-container__button">
            할 일 추가 
        </button>
    </form>
    </div>;
};

export default TodoForm;