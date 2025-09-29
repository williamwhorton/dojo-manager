'use client'

import { useEffect, useState } from "react";

const query = `
query GetAllUsers {
  Users {
    docs {
      id
      fullName
    }
  }
}`

export default function PageClient() {
  const [ students, setStudents ] = useState<any[]>( [] );
  useEffect( () => {
    setTimeout(() => {
      fetch('http://localhost:3000/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query
        })
      } ).then(response => response.json()).then(data => {
        setStudents(data.data.Users.docs);
      });
    }, 1000 );
  }, [] );


  return (
    <div>
      <h1>Page Client</h1>
      { students.map( (student) => (
        <h2 className={'font-semibold text-blue-600'} key={student.id}>{student.fullName}</h2>
      ))}
    </div>
  );
}
