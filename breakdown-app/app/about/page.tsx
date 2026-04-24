"use client";

import { useState } from "react";
import Image from 'next/image';
import { Typography, Button, Link, autocompleteClasses } from '@mui/material';
import { Directions } from "@mui/icons-material";
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { motion } from "framer-motion";


const CardStyle = styled(Paper)(({ theme }) => ({
  minHeight: 420,
  padding: theme.spacing(2),
  ...theme.typography.body2,
  textAlign: 'center',
}));

export default function Home() {
  
  return (
    <div style={{ 
        padding: 64,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        }}>
        <div>
            <p
            style={{
                fontSize: 56,
                fontWeight: 'bold',
                marginBottom: 24,
                letterSpacing: '-0.04em',
                color:`#1D2D44`,
                marginTop: 0,
            }}
            >
                The Research-Practice Interface
            </p>
        </div>

        <Stack direction="column" spacing={4}>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.5 }}
                transition={{ duration: 0.6 }}
                >
              <CardStyle variant="elevation">
                  <p
                      style={{
                          fontSize: 36,
                          marginBottom: 24,
                          letterSpacing: '-0.04em',
                          color: `#1D2D44`,
                      }}
                  >
                      What is the Research - Practice Interface?
                  </p>
                  <p style={{maxWidth: "60%", margin: "0 auto", fontSize: 18}}>
                    The Research-Practice Interface describes the connection (or lack of) between <b>researchers</b> and <b>practitioners</b>, bridging theoretical knowledge and practical application. It's a <b>bidirectional</b> relationship-- both sides can interact and communicate to improve their methods and practices. When discussing this framework, we often talk about <b>"bridging the gap"</b> between the researchers and the practicioners, such as teachers and policy makers.
                  </p>
              </CardStyle>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6 }}
                >
              <CardStyle variant="elevation">
                  <p
                      style={{
                          fontSize: 36,
                          marginBottom: 24,
                          letterSpacing: '-0.04em',
                          color: `#1D2D44`,
                      }}
                  >
                      What Issues are Present?
                  </p>
                  <p style={{maxWidth: "60%", margin: "0 auto", fontSize: 18}}>
                    One large issue is that research points in a general direction without defining clear takeaways for practictioners. In other words, <b>researchers tend to make real-world issues theoretical</b> (Sato & Cárcamo, 2024). For example, research has shown that motivation is important for learning an L2; however, this does not provide a clear path for language teachers as to how they can implement motivating factors into their work. 
                    <br></br><br></br>
                    Another issue is that linguistics <b>research can be inaccessible</b> to non-linguists; long papers are filled with jargon and references to hypotheses and concepts that prevent non-linguists from easily understanding them or providing feedback.
                    <br></br><br></br>
                    This leads practitioners wondering, <br></br>
                    <em>What does the research say about X?</em>
                      </p>
              </CardStyle>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6 }}
                >
              <CardStyle variant="elevation">
                  <p
                      style={{
                          fontSize: 36,
                          marginBottom: 24,
                          letterSpacing: '-0.04em',
                          color: `#1D2D44`,
                      }}
                  >
                      What Does Research Say?
                  </p>
                  <p style={{maxWidth: "60%", margin: "0 auto", fontSize: 18}}>
                    - Most research focuses on teachers' perception of researchers, yet the reverse (researchers' perception of teachers) is equally important (Sato & Cárcamo, 2024)
                    <br></br><br></br>
                    - Proposed solutions include educating graduate students (future reserachers) on research-practice, workshops/activities where people can interact and share ideas (Sato & Cárcamo, 2024), professional development programs, and recognition by policymakers (Yuan et al., 2022)
                    <br></br><br></br>
                    - Government funded programs can connect researchers to practitioners and bridge the gap in big ways. For example, funding by England's Department of Education (2018-2023) allowed professional development sessions and resource production that improved GCSE exams. (Marsden & Hawkes, 2023)                  
                    </p>
              </CardStyle>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6 }}
                >
              <CardStyle variant="elevation">
                  <p
                      style={{
                          fontSize: 36,
                          marginBottom: 24,
                          letterSpacing: '-0.04em',
                          color: `#1D2D44`,
                      }}
                  >
                      How Does Breakdown Help?
                  </p>
                  <p style={{maxWidth: "60%", margin: "0 auto", fontSize: 18}}>
                    The goal of the tool is to <b>make linguistics research easy to understand</b> for non-linguistics. After uploading a file, the tool breaks it down into the most important categories (such as "participants" and "methodology"), making research easily digestible so practitioners can spend more time reflecting on implementation.
                    <br></br><br></br>
                    Additionally, the site allows users to provide feedback. This <b>fosters discussion</b>, both between researchers and across the r-p gap, allowing implementation ideas and real change begin to take shape. </p>
              </CardStyle>
            </motion.div>
            
        </Stack>
        <br></br>
        <h2><b>References</b></h2>
        <p><em>
            Marsden, E., & Hawkes, R. (2023). Situating practice in a limited exposure, foreign languages school curriculum. In Suzuki, Y. (Ed.), Practice and automatization in L2 research (pp. 89–118). Routledge.
            <br></br><br></br>
            Sato, M., & Cárcamo, B. (2024). Be(com)ing an educational researcher in the global south (and beyond): A focus on the research-practice relationship. Educational Researcher. Advance online publication. doi:10.3102/0013189X241231548
            <br></br><br></br>
            Yuan, R., Lee, I., De Costa, P. I., Yang, M., & Liu, S. (2022). TESOL teacher educators in higher education: A review of studies from 2010 to 2020. Language Teaching, 55(4), 434–469. doi:10.1017/S0261444822000209
        </em>
        </p>
      
    </div>
  );
}